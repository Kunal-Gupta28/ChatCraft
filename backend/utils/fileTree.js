const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isFileNode = (value) => isObject(value) && isObject(value.file);

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

const normalizeFileTree = (fileTree) => normalizeNode(fileTree);

const getFileNode = (fileTree, filePath) => {
  const parts = filePath.split("/").filter(Boolean);
  let current = fileTree;

  for (const part of parts) {
    if (!isObject(current) || !isObject(current[part])) return null;
    current = current[part];
  }

  return isFileNode(current) ? current : null;
};

module.exports = { getFileNode, normalizeFileTree };
