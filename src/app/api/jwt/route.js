import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const user = await getUserSession();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role || "buyer"
    };

    const secret = process.env.JWT_SECRET || "supersecret_b13_assignment_10";
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error in JWT API Route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
