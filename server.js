const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();

app.use(cors());

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Skapa uploads-mappen automatiskt
const uploadFolder = "uploads";

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Konfigurera videouppladdning
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage
});

// Testa servern
app.get("/", (req, res) => {
  res.send("Vidlix AI Server is running!");
});

// Upload + AI transkribering
app.post("/upload", upload.single("video"), async (req, res) => {
console.log("UPLOAD REQUEST RECEIVED!");
  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No video uploaded"
      });
    }

    console.log("Video uploaded:", req.file.filename);

    // Skicka videon till AI
    const transcription =
      await openai.audio.transcriptions.create({
        file: fs.createReadStream(req.file.path),
        model: "gpt-4o-mini-transcribe"
      });

    console.log("Transcript:", transcription.text);

    res.json({
      message: "Video analyzed successfully!",
      filename: req.file.filename,
      transcript: transcription.text
    });

  } catch (error) {

    console.error("AI Error:", error);

    res.status(500).json({
      error: "AI analysis failed"
    });

  }

});

// Starta servern
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Vidlix server running on port ${PORT}`);
});
