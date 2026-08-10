export const parseCommand = (command) => {
  if (!command?.mainItem || !Array.isArray(command.commands)) return null;
  return { command: command.mainItem, args: command.commands };
};

export const inferCommands = (files) => {
  let packageJson;
  try {
    packageJson = JSON.parse(files["package.json"] || "null");
  } catch {
    packageJson = null;
  }

  const hasDependencies = Boolean(
    packageJson?.dependencies || packageJson?.devDependencies,
  );
  const build = hasDependencies ? { command: "npm", args: ["install"] } : null;

  if (packageJson?.scripts?.start) {
    return { build, start: { command: "npm", args: ["start"] } };
  }
  if (packageJson?.scripts?.dev) {
    return {
      build,
      start: {
        command: "npm",
        args: ["run", "dev", "--", "--host", "0.0.0.0"],
      },
    };
  }
  if (packageJson?.main) {
    return { build, start: { command: "node", args: [packageJson.main] } };
  }
  if (files["app.js"] !== undefined) {
    return { build, start: { command: "node", args: ["app.js"] } };
  }
  if (files["server.js"] !== undefined) {
    return { build, start: { command: "node", args: ["server.js"] } };
  }

  return { build, start: null };
};

export const buildFallbackPreviewUrl = (runtimeFiles) => {
  const cssFiles = Object.keys(runtimeFiles).filter((path) => path.endsWith(".css"));
  const combinedCss = cssFiles.map((path) => runtimeFiles[path]).join("\n");

  const clientJsFiles = Object.keys(runtimeFiles).filter(
    (path) =>
      path.endsWith(".js") &&
      !path.includes("server.js") &&
      !path.includes("node_modules") &&
      (path.startsWith("public/") || path.includes("script") || path.includes("index") || path.includes("main"))
  );
  const combinedClientJs = clientJsFiles.map((path) => runtimeFiles[path]).join("\n;\n");

  let htmlContent = runtimeFiles["public/index.html"] || runtimeFiles["index.html"] || "";

  if (htmlContent) {
    if (combinedCss) {
      if (htmlContent.includes("</head>")) {
        htmlContent = htmlContent.replace("</head>", `<style>\n${combinedCss}\n</style>\n</head>`);
      } else {
        htmlContent = `<style>\n${combinedCss}\n</style>\n` + htmlContent;
      }
    }

    if (combinedClientJs) {
      if (htmlContent.includes("</body>")) {
        htmlContent = htmlContent.replace("</body>", `<script>\n${combinedClientJs}\n</script>\n</body>`);
      } else {
        htmlContent += `<script>\n${combinedClientJs}\n</script>`;
      }
    }
  } else {
    htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Preview</title>
  <style>
    ${combinedCss}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    ${combinedClientJs}
  </script>
</body>
</html>`;
  }

  const blob = new Blob([htmlContent], { type: "text/html" });
  return URL.createObjectURL(blob);
};
