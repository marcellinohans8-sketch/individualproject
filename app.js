if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.redirect("/public");
});

app.post("/ai/prompt", async (req, res, next) => {
  try {
    const { prompt } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `${prompt}
      
Answer in a concise and clear manner.
Provide the answer in markdown format with maximum 200 words.`,
    });

    res.json({ result: response.text });
  } catch (error) {
    next(error);
  }
});

app.use(router);
app.use(errorHandler);

module.exports = app;
