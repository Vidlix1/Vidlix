const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());

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

// Testa att servern fungerar
app.get("/", (req, res) => {
  res.send("Vidlix AI Server is running!");
});

// Ta emot video
app.post("/upload", upload.single("video"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: "No video uploaded"
    });
  }

  console.log("Video uploaded:", req.file.filename);

  res.json({
    message: "Video uploaded successfully!",
    filename: req.file.filename
  });

});

// Starta servern
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Vidlix server running on port ${PORT}`);
});
