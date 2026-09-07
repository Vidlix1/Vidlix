const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Vidlix AI Server is running!");
});

app.listen(PORT, () => {
  console.log(`Vidlix server running on port ${PORT}`);
});
