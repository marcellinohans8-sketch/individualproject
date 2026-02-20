const { GoogleGenAI } = require("@google/genai");
const { Lawyer } = require("../models");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

class aiController {
  static async recommend(req, res) {
    try {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({
          message: "Pertanyaan tidak boleh kosong",
        });
      }

      const lawyers = await Lawyer.findAll({
        attributes: ["id", "fullName", "officeAddress", "rating"],
      });

      const prompt = `
Berikut daftar lawyer:

${JSON.stringify(lawyers)}

User bertanya:
"${question}"

Pilih lawyer paling sesuai dan jelaskan alasannya.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error) {
      console.error("AI ERROR:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = aiController;
