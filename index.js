const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config;

mongoose.connect(process.env.MONGODB_URI);
const Tasks = require("./models/Task");
const app = express();

app.use(
  cors({
    origin: "http://example.com", // Remplacez par votre domaine autorisé
    methods: ["GET", "POST"], // Méthodes HTTP autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
  })
);
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.status(200).json(tasks);
  } catch (error) {}
});

app.post("/", async (req, res) => {
  try {
    const newTasks = new Tasks({
      task_name: req.body.task_name,
    });
    await newTasks.save();
    res.status(200).json(newTasks);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "y'a rien à voir, circulez" });
});

app.listen(process.env.PORT, () => {
  console.log("Tchoutchou ça démarre");
});
