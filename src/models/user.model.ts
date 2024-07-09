import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Please enter a username."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password."],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.models.users || mongoose.model("users", userSchema);
