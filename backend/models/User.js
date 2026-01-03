const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================
    // AUTH FIELDS
    // =====================
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // =====================
    // PROFILE CONTEXT (BLOCK 1)
    // =====================
    profileContext: {
      age: {
        type: Number,
      },

      occupationType: {
        type: String,
        enum: ["student", "job", "other"],
      },

      workingHoursPerDay: {
        type: Number,
      },

      workMode: {
        type: String,
        enum: ["wfh", "onsite", "hybrid"],
      },

      // =====================
      // RECENT MEDICAL ISSUES
      // =====================
      recentMedicalIssues: {
        frequentHeadaches: {
          type: Boolean,
          default: false,
        },
        persistentFatigue: {
          type: Boolean,
          default: false,
        },
        suddenWeightChanges: {
          type: Boolean,
          default: false,
        },
        digestiveDiscomfort: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
