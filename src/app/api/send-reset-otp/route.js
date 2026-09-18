import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { sendOTPEmail } from "@/lib/email";

let client;
if (!global._mongoClientOTP) {
  global._mongoClientOTP = new MongoClient(process.env.MONGODB_URI);
}
client = global._mongoClientOTP;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body?.email?.trim();

    if (!email) {
      return NextResponse.json({ message: "Email address is required." }, { status: 400 });
    }

    const db = client.db(process.env.AUTH_DB_NAME);

    // Search case-insensitively
    const user = await db.collection("user").findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email address." },
        { status: 404 }
      );
    }

    const userEmail = user.email.toLowerCase();

    // Generate 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Remove any previous OTPs for this user
    await db.collection("password_reset_tokens").deleteMany({
      email: userEmail,
    });

    // Save fresh OTP token
    await db.collection("password_reset_tokens").insertOne({
      email: userEmail,
      otp,
      expiresAt,
      createdAt: new Date(),
    });

    // Send code to user's registered email
    await sendOTPEmail({
      email: user.email,
      otp,
      userName: user.name || "ArtHall Member",
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (err) {
    console.error("[send-reset-otp] Error:", err);
    return NextResponse.json(
      { message: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
