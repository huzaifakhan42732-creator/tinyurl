import mongoose from "mongoose";

// Url schema: stores each shortened URL.
// "user" is a reference to the registered User (optional for guest links).
const UrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

// Reuse the model if it already exists (prevents errors during Next.js hot reload)
const Url = mongoose.models.Url || mongoose.model("Url", UrlSchema);

export default Url;
