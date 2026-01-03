const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // EXISTING FIELDS (UNCHANGED)
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

    // 🔹 BLOCK 1: CONTEXT DATA (NEW)
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
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
