import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { hashPassword } from "better-auth/crypto";
import crypto from "crypto";

let client;
if (!global._mongoClientOTP) {
  global._mongoClientOTP = new MongoClient(process.env.MONGODB_URI);
}
client = global._mongoClientOTP;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp, newPassword, verifyOnly } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();
    const db = client.db(process.env.AUTH_DB_NAME);

    // ── 1. Check OTP in password_reset_tokens ──
    const otpRecord = await db.collection("password_reset_tokens").findOne({
      email: normalizedEmail,
      otp: cleanOtp,
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      await db.collection("password_reset_tokens").deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // If client only requested OTP check (Step 2 verification)
    if (verifyOnly) {
      return NextResponse.json({
        valid: true,
        message: "Verification code is valid.",
      });
    }

    // ── 2. Password validation ──
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // ── 3. Find User ──
    const user = await db.collection("user").findOne({
      email: { $regex: `^${email.trim()}$`, $options: "i" },
    });

    if (!user) {
      return NextResponse.json({ message: "User account not found." }, { status: 404 });
    }

    const userIdStr = user._id ? user._id.toString() : user.id;

    // ── 4. Hash password using Better-Auth's native crypto hasher ──
    // Better-Auth expects "salt:hash" format, not raw bcrypt!
    const hashedPassword = await hashPassword(newPassword);

    // ── 5. Find existing credential account or create one ──
    const credentialAccount = await db.collection("account").findOne({
      $or: [
        { userId: userIdStr, providerId: "credential" },
        { userId: user.id, providerId: "credential" },
        { accountId: userIdStr, providerId: "credential" },
      ],
    });

    if (credentialAccount) {
      await db.collection("account").updateOne(
        { _id: credentialAccount._id },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date(),
          },
        }
      );
      console.log("[verify-reset-otp] Updated password for:", normalizedEmail);
    } else {
      // User originally signed up via Google or other provider; create credential entry
      const newAccountId = crypto.randomBytes(16).toString("hex");
      await db.collection("account").insertOne({
        id: newAccountId,
        userId: userIdStr,
        accountId: userIdStr,
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("[verify-reset-otp] Created new credential account for:", normalizedEmail);
    }

    // ── 6. Remove the used OTP token ──
    await db.collection("password_reset_tokens").deleteOne({ _id: otpRecord._id });

    // ── 7. Invalidate existing user sessions ──
    await db.collection("session").deleteMany({
      $or: [
        { userId: userIdStr },
        { userId: user.id },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now sign in with your new password.",
    });
  } catch (err) {
    console.error("[verify-reset-otp] Error:", err);
    return NextResponse.json(
      { message: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
