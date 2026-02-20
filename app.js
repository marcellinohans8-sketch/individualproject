if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(
  cors({
    origin: "https://frontend-beta-flame-87.vercel.app",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(router);
app.use(errorHandler);

module.exports = app;
