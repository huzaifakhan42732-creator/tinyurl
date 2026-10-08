import mongoose from "mongoose";

// Url schema: stores each shortened URL.
// "user" references registered User (null for guests)
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
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure model reflects current schema in hot-reload
delete mongoose.models.Url;
const Url = mongoose.model("Url", UrlSchema);

export default Url;
