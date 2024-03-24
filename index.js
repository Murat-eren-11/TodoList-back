const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);
const Tasks = require("./models/Task");
const app = express();

app.use(
  cors({
    origin: "https://murattodolist.netlify.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.status(200).json(tasks);
  } catch (error) {}
});

app.post("/newtask", async (req, res) => {
  try {
    const newTask = new Tasks({
      task_name: req.body.task_name,
    });
    await newTask.save();
    res.status(200).json({ task_name: newTask.task_name });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    await Tasks.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "y'a rien à voir, circulez" });
});

app.listen(process.env.PORT, () => {
  console.log("Tchoutchou ça démarre");
});
