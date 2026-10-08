import mongoose from "mongoose";

// User schema: stores registered users.
// The password field stores only the bcrypt HASH, never the plain-text password.
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Reuse the model if it already exists (prevents errors during Next.js hot reloaddfg)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
