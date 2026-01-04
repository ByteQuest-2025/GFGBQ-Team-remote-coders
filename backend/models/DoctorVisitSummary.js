const mongoose = require("mongoose");

const doctorVisitSummarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  summary: {
    reason_for_visit: String,
    key_risk_drivers: [String],
    relevant_trends: [String],
    suggested_evaluations: [String]
  },

  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "DoctorVisitSummary",
  doctorVisitSummarySchema
);
