const mongoose = require('mongoose');

const CharityGoalSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  goal: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.CharityGoal || mongoose.model('CharityGoal', CharityGoalSchema);
