import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Url from "@/models/Url";
import { getCurrentUserId } from "@/lib/auth";

// Generates a random code of letters and numbers, e.g. "a8Kx92"
function generateShortCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Checks that the string is a valid http/https URL
function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    // 1. Check authentication (optional: guests can also shorten links)
    const userId = await getCurrentUserId();

    // 2. Validate the URL
    const { originalUrl } = await request.json();
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid URL starting with http:// or https://",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // 3. Generate a unique short code (retry if it already exists)
    let shortCode = generateShortCode();
    while (await Url.findOne({ shortCode })) {
      shortCode = generateShortCode();
    }

    // 4. Save the URL (linked to the user if logged in, otherwise null)
    const newDoc = {
      originalUrl,
      shortCode,
    };
    if (userId) {
      newDoc.user = userId;
    }

    await Url.create(newDoc);

    // 5. Build the full short URL using the current site's address
    const baseUrl = new URL(request.url).origin;

    return NextResponse.json(
      {
        success: true,
        originalUrl,
        shortCode,
        shortUrl: `${baseUrl}/${shortCode}`,
        isGuest: !userId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create URL error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error while creating short URL",
      },
      { status: 500 }
    );
  }
}
