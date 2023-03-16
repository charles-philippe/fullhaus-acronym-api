const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;
const secretKey = process.env.SECRET_KEY;


// Middleware
app.use(helmet()); // adds security-related headers to HTTP response for secured server
app.use(cors());
app.use(bodyParser.json());

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== secretKey) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
};

// Connect to MongoDB
mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Define acronym schema
const acronymSchema = new mongoose.Schema({
  acronym: { type: String, required: true },
  definition: { type: String, required: true },
});

// Define acronym model
const Acronym = mongoose.model("Acronyms", acronymSchema);

// Routes
// GET /acronym
app.get("/acronym", async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const query = { acronym: { $regex: search, $options: "i" } };
  const options = { limit, skip: (page - 1) * limit };
  try {
    const acronyms = await Acronym.find(query, null, options);
    const count = await Acronym.countDocuments(query);
    const hasNextPage = count > options.skip + acronyms.length;
    res.set("X-Has-Next-Page", hasNextPage);
    res.json(acronyms);    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /acronym
app.post("/acronym", authenticateUser, async (req, res) => {
  const { acronym, definition } = req.body;
  if (!acronym || !definition) {
    res.status(400).json({ error: "Missing required fields" });
  } else {
    try {
      const newAcronym = new Acronym({ acronym, definition });
      await newAcronym.save();
      res.json(newAcronym);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// PATCH /acronym/:acronymID
app.patch("/acronym/:acronymID", authenticateUser, async (req, res) => {
  const { acronymID } = req.params;
  const { acronym, definition } = req.body;
  if (!acronym || !definition) {
    res.status(400).json({ error: "Missing required fields" });
  } else {
    try {
      const updatedAcronym = await Acronym.findByIdAndUpdate(
        acronymID,
        { acronym, definition },
        { new: true }
      );
      res.json(updatedAcronym);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// DELETE /acronym/:acronymID
app.delete('/acronym/:acronymID', authenticateUser, async (req, res) => {
    const { acronymID } = req.params;

    try {
    const deletedAcronym = await Acronym.findByIdAndDelete(acronymID);
    res.json(deletedAcronym);
    } catch (err) {
    res.status(400).json({ message: err.message });
    }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});