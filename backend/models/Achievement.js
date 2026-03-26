const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  competition: { type: String, required: true },
  position: { type: String, required: true }, // e.g., 1st, Winner, Runner-up
  date: { type: Date, required: true },
  category: { type: String, required: true }, // e.g., Sports, Academic, Arts
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
