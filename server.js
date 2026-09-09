const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  }
});

// Student Model
const Student = mongoose.model("Student", studentSchema);


// ===============================
// CREATE
// ===============================

app.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      message: "Student created successfully",
      data: student
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating student",
      error: error.message
    });
  }
});


// ===============================
// READ ALL
// ===============================

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      count: students.length,
      data: students
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching students",
      error: error.message
    });
  }
});


// ===============================
// READ ONE
// ===============================

app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching student",
      error: error.message
    });
  }
});


// ===============================
// UPDATE
// ===============================

app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: student
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating student",
      error: error.message
    });
  }
});


// ===============================
// DELETE
// ===============================

app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      data: student
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting student",
      error: error.message
    });
  }
});


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Node.js MongoDB CRUD API is running"
  });
});


// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});