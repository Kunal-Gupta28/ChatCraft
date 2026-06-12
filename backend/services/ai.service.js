const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// get result from gemini
const generateResult = async (prompt) => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
      systemInstruction: `You are an expert full-stack JavaScript developer. Return valid JSON only.

For normal conversation, return:
{"text":"Your answer"}

When creating or changing a runnable project, return:
{
  "text":"Short explanation",
  "fileTree": {
    "package.json": {"file":{"contents":"{\\"scripts\\":{\\"start\\":\\"node app.js\\"}}"}},
    "app.js": {"file":{"contents":"console.log('ready')"}},
    "src": {
      "index.js": {"file":{"contents":"console.log('nested file')"}}
    }
  },
  "buildCommand": {"mainItem":"npm","commands":["install"]},
  "startCommand": {"mainItem":"npm","commands":["start"]}
}

Rules:
- Every file must use {"file":{"contents":"..."}}.
- Folders must be plain nested objects. Do not use a directory wrapper.
- Commands must contain mainItem as a string and commands as an array of strings.
- Include a valid package.json for Node-based projects.
- The start command must launch a server that listens on 0.0.0.0.
- Preserve existing behavior when modifying code.
- Do not use ambiguous barrel filenames such as routes/index.js.`,
    });

    const rawData = result.response.candidates[0].content.parts[0].text;
    return JSON.parse(rawData);
  } catch (error) {
    console.error(error?.status);
    console.error(error.message);

    // Return user-friendly message
    return {
      text: "⚠️ Gemini is currently overloaded or unavailable. Please try again shortly.",
    };
  }
};

module.exports = { generateResult };
