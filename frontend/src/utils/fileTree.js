const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const isFileNode = (value) => isObject(value) && isObject(value.file);

const insertAtPath = (target, pathParts, value) => {
  const [part, ...rest] = pathParts;
  if (!part) return;

  if (rest.length === 0) {
    target[part] = value;
    return;
  }

  if (!isObject(target[part]) || isFileNode(target[part])) {
    target[part] = {};
  }

  insertAtPath(target[part], rest, value);
};

const normalizeNode = (node) => {
  if (!isObject(node)) return {};

  const source = isObject(node.directory) ? node.directory : node;
  const normalized = {};

  for (const [rawName, value] of Object.entries(source)) {
    if (!isObject(value)) continue;

    const pathParts = rawName.split("/").filter(Boolean);
    if (pathParts.length === 0) continue;

    const normalizedValue = isFileNode(value)
      ? { file: { ...value.file } }
      : normalizeNode(value);

    insertAtPath(normalized, pathParts, normalizedValue);
  }

  return normalized;
};

export const normalizeFileTree = (fileTree) => normalizeNode(fileTree);

export const toWebContainerTree = (fileTree) => {
  const normalized = normalizeFileTree(fileTree);

  return Object.fromEntries(
    Object.entries(normalized).map(([name, value]) => [
      name,
      isFileNode(value)
        ? { file: { ...value.file } }
        : { directory: toWebContainerTree(value) },
    ]),
  );
};

export const flattenFileTree = (fileTree) => {
  const files = {};

  const walk = (node, basePath = "") => {
    for (const [name, value] of Object.entries(normalizeFileTree(node))) {
      const fullPath = basePath ? `${basePath}/${name}` : name;
      if (isFileNode(value)) {
        files[fullPath] = value.file.contents ?? "";
      } else {
        walk(value, fullPath);
      }
    }
  };

  walk(fileTree);
  return files;
};

export const applyFileChanges = (fileTree, changes) => {
  const normalized = normalizeFileTree(fileTree);

  const cloneNode = (node, basePath = "") =>
    Object.fromEntries(
      Object.entries(node).map(([name, value]) => {
        const fullPath = basePath ? `${basePath}/${name}` : name;
        if (isFileNode(value)) {
          return [
            name,
            {
              file: {
                ...value.file,
                contents: changes[fullPath] ?? value.file.contents ?? "",
              },
            },
          ];
        }

        return [name, cloneNode(value, fullPath)];
      }),
    );

  return cloneNode(normalized);
};

export const mergeFileTrees = (fileTree, changesTree) => {
  const mergeNode = (baseNode, changeNode) => {
    const merged = normalizeFileTree(baseNode);
    const changes = normalizeFileTree(changeNode);

    for (const [name, value] of Object.entries(changes)) {
      if (isFileNode(value)) {
        merged[name] = { file: { ...value.file } };
        continue;
      }

      const currentValue = isFileNode(merged[name]) ? {} : merged[name];
      merged[name] = mergeNode(currentValue, value);
    }

    return merged;
  };

  return mergeNode(fileTree, changesTree);
};

export const getFileTreeDiffs = (currentTree, suggestionTree) => {
  const currentFiles = flattenFileTree(currentTree);
  const suggestedFiles = flattenFileTree(suggestionTree);

  return Object.entries(suggestedFiles)
    .filter(([path, next]) => currentFiles[path] !== next)
    .map(([path, next]) => ({
      path,
      previous: currentFiles[path] ?? "",
      next,
      kind: currentFiles[path] === undefined ? "added" : "modified",
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
};
