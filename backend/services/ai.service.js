const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getProjectContext = (fileTree) => {
  if (!fileTree || typeof fileTree !== "object") return "";

  const serializedTree = JSON.stringify(fileTree);
  const maxContextLength = 60000;
  const visibleTree =
    serializedTree.length > maxContextLength
      ? `${serializedTree.slice(0, maxContextLength)}\n[Project context truncated]`
      : serializedTree;

  return `\n\nCurrent project file tree:\n${visibleTree}`;
};

const cleanJsonText = (rawText) => {
  if (!rawText) return "{}";
  return rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

/**
 * Smart mock AI response when API quota is exhausted or USE_MOCK_AI is active
 */
const getMockResponse = (prompt = "") => {
  const p = prompt.toLowerCase();

  if (p.includes("express") || p.includes("server") || p.includes("backend") || p.includes("api")) {
    return {
      text: "Created Express.js server with basic routes and package setup.",
      fileTree: {
        "package.json": {
          file: {
            contents: JSON.stringify(
              {
                name: "express-app",
                version: "1.0.0",
                main: "server.js",
                scripts: { start: "node server.js" },
                dependencies: { express: "^4.18.2" },
              },
              null,
              2
            ),
          },
        },
        "server.js": {
          file: {
            contents: `const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.use(express.json());\n\napp.get('/', (req, res) => {\n  res.json({ message: 'Hello from ChatCraft Express Server!' });\n});\n\napp.listen(PORT, '0.0.0.0', () => {\n  console.log(\`Server is running on port \${PORT}\`);\n});`,
          },
        },
      },
      buildCommand: { mainItem: "npm", commands: ["install"] },
      startCommand: { mainItem: "npm", commands: ["start"] },
    };
  }

  return {
    text: `Mock AI response for: "${prompt}". Ready to generate code and help build your application!`,
  };
};

// get result from gemini with automatic model fallback & mock data fallback
const generateResult = async (prompt, currentFileTree) => {
  // If USE_MOCK_AI is enabled in .env, return instant mock response
  if (process.env.USE_MOCK_AI === "true") {
    console.log("[AI SERVICE] Returning instant Mock AI response");
    return getMockResponse(prompt);
  }

  const modelNames = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
  ];

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `User request:\n${prompt}${getProjectContext(currentFileTree)}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
        systemInstruction: `You are an expert full-stack JavaScript developer. Return valid JSON only.

For normal conversation, return:
{"text":"Your answer"}

When creating or changing project code, return:
{
  "text":"Short explanation",
  "fileTree": {
    "package.json": {"file":{"contents":"{\\"scripts\\":{\\"start\\":\\"node server.js\\"}}"}},
    "server.js": {"file":{"contents":"console.log('ready')"}}
  },
  "buildCommand": {"mainItem":"npm","commands":["install"]},
  "startCommand": {"mainItem":"npm","commands":["start"]}
}

Rules:
- Every file must use {"file":{"contents":"..."}}.
- Folders must be plain nested objects. Do not use a directory wrapper.
- Include only new or changed files in fileTree. Do not include unchanged files.
- Do not delete files. Explain any deletion recommendation in text instead.
- Commands must contain mainItem as a string and commands as an array of strings.
- Include a valid package.json for Node-based projects.
- The start command must launch a server that listens on 0.0.0.0.
- Preserve existing behavior when modifying code.
- Do not use ambiguous barrel filenames such as routes/index.js.`,
      });

      const responseText = result.response.text();
      const cleanedText = cleanJsonText(responseText);
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error(`Gemini model ${modelName} error:`, error.message);
    }
  }

  // Fallback to smart mock response if all API models fail
  console.log("[AI SERVICE] All Gemini API models failed/rate-limited. Returning fallback mock response.");
  return getMockResponse(prompt);
};

const generateAudioResult = async ({ audioBase64, mimeType, currentFileTree }) => {
  if (process.env.USE_MOCK_AI === "true") {
    return getMockResponse("voice command");
  }

  const modelNames = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
  ];

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `The user sent a voice command. Understand the recording and respond to their request.${getProjectContext(currentFileTree)}`,
              },
              { inlineData: { mimeType, data: audioBase64 } },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
        systemInstruction: `You are an expert full-stack JavaScript developer. Return valid JSON only.

For normal conversation, return: {"text":"Your answer"}

For code changes, return:
{"text":"Short explanation","fileTree":{"server.js":{"file":{"contents":"console.log('ready')"}}},"buildCommand":{"mainItem":"npm","commands":["install"]},"startCommand":{"mainItem":"npm","commands":["start"]}}

Rules:
- Every file must use {"file":{"contents":"..."}}.
- Folders must be plain nested objects.
- Include only new or changed files in fileTree. Do not delete files.
- Commands must contain mainItem as a string and commands as an array of strings.
- The start command must launch a server that listens on 0.0.0.0.
- Preserve existing behavior when modifying code.`,
      });

      const responseText = result.response.text();
      const cleanedText = cleanJsonText(responseText);
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error(`Gemini audio model ${modelName} error:`, error.message);
    }
  }

  return getMockResponse("voice command");
};

module.exports = { generateResult, generateAudioResult };
