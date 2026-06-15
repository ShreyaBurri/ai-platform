const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const app = express();

const chatRoutes = require("./routes/chatRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);


app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});