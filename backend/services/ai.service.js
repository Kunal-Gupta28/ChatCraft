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

// get result from gemini with automatic model fallback
const generateResult = async (prompt, currentFileTree) => {
  const modelNames = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
  ];

  let lastError = null;

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
      lastError = error;
    }
  }

  throw new Error(`Gemini API Error: ${lastError?.message || "Failed to generate AI response"}`);
};

const generateAudioResult = async ({ audioBase64, mimeType, currentFileTree }) => {
  const modelNames = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
  ];

  let lastError = null;

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
      lastError = error;
    }
  }

  throw new Error(`Gemini Audio API Error: ${lastError?.message || "Failed to process audio command"}`);
};

module.exports = { generateResult, generateAudioResult };
