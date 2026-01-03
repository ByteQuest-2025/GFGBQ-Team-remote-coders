const mongoose = require("mongoose");

const stressAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  phq9Score: {
    type: Number,
    required: true,
    min: 0,
    max: 27
  },
  severity: {
    type: String,
    required: true
  },
  escalationRecommended: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("StressAssessment", stressAssessmentSchema);
