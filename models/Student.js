const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: String, required: true },
  branch: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  overallcgpa: { type: Number, required: true, min: 0, max: 10 },
  backlogs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
