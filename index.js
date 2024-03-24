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
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des tâches." });
  }
});

app.post("/newtask", async (req, res) => {
  try {
    const newTask = new Tasks({
      task_name: req.body.task_name,
    });
    await newTask.save();
    res.status(200).json({ task_name: newTask.task_name });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une tâche :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout d'une tâche." });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Tasks.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res
        .status(404)
        .json({ error: "La tâche à supprimer est introuvable." });
    }
    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la tâche." });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "y'a rien à voir, circulez" });
});

app.listen(process.env.PORT, () => {
  console.log("Tchoutchou ça démarre");
});
