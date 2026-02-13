require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gndec_registration';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// API to register student
app.post('/api/register', async (req, res) => {
  try {
    const data = req.body;
    // Basic server-side validation
    if (!data.name || !data.semester || !data.branch || !data.usn || !data.email || !data.gender || data.overallcgpa === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const student = new Student({
      name: data.name,
      semester: data.semester,
      branch: data.branch,
      usn: data.usn,
      email: data.email,
      gender: data.gender,
      overallcgpa: parseFloat(data.overallcgpa),
      backlogs: parseInt(data.backlogs || 0)
    });

    await student.save();
    return res.json({ success: true, message: 'Registered successfully', student });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) { // duplicate key
      return res.status(409).json({ success: false, message: 'USN already exists' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API to fetch all students (for checking)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));





app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/gndec_registration", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 🗑️ DELETE route - by USN or ID
app.delete("/delete/:usn", async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({ usn: req.params.usn });
    if (deletedStudent) {
      res.status(200).json({ message: "Student deleted successfully!" });
    } else {
      res.status(404).json({ message: "Student not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
