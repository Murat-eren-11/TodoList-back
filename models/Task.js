const mongoose = require("mongoose");

const Tasks = mongoose.model("Tasks", {
  task_name: String,
});

module.exports = Tasks;
