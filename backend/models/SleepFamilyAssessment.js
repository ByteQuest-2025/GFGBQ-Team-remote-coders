const mongoose = require("mongoose");

const sleepFamilyAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Sleep data
  averageSleepHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  sleepConsistency: {
    type: String,
    enum: ["consistent", "irregular", "highly_irregular"],
    required: true
  },
  screenTimeBeforeSleepMinutes: {
    type: Number,
    default: 0
  },
  sleepQuality: {
    type: String,
    enum: ["good", "average", "poor"],
    required: true
  },

  // Family history
  familyHistory: {
    diabetes: { type: Boolean, default: false },
    hypertension: { type: Boolean, default: false },
    heartDisease: { type: Boolean, default: false },
    mentalHealthConditions: { type: Boolean, default: false }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "SleepFamilyAssessment",
  sleepFamilyAssessmentSchema
);
