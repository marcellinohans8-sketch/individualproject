const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCTnAoUkfR6GspC34HGlfYRUkPOXREvDLE",
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: "Jelaskan dong apa itu Hactiv8",
    });
    console.log(response.text);
  } catch (error) {
    console.log(error);
  }
}
main();
