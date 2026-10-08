import { cookies } from "next/headers";
import mongoose from "mongoose";

// Name of the cookie that stores the logged-in user's ID
export const AUTH_COOKIE = "userId";

// Returns the logged-in user's ID from the cookie, or null if not logged in.
export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(AUTH_COOKIE)?.value;

  // Make sure the cookie holds a valid MongoDB ObjectId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return userId;
}
