import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Url from "@/models/Url";
import { getCurrentUserId } from "@/lib/auth";

// GET /api/urls -> returns only the logged-in user's URLs
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    // Filter by user so nobody can see another user's URLs
    const urls = await Url.find({ user: userId })
      .select("originalUrl shortCode createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error("Get URLs error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error while fetching URLs" },
      { status: 500 }
    );
  }
}

// DELETE /api/urls?id=URL_ID -> deletes one of the logged-in user's URLs
export async function DELETE(request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid URL id" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Find the URL
    const url = await Url.findById(id);
    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL not found" },
        { status: 404 }
      );
    }

    // 2. Make sure it belongs to the logged-in user
    if (url.user.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own URLs" },
        { status: 403 }
      );
    }

    // 3. Delete it
    await Url.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error("Delete URL error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error while deleting URL" },
      { status: 500 }
    );
  }
}
