import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // -----------------------------------------------------
    // Create NextAuth session by setting NextAuth cookie
    // -----------------------------------------------------
    const sessionToken = crypto.randomUUID();

    (await cookies()).set("__Secure-next-auth.session-token", sessionToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    // Store token in database OR associate it manually
    // Minimal version:
    await User.updateOne(
      { _id: user._id },
      { sessionToken, sessionTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          phone: user.phone,
          plan: user.plan,
          renewal: user.renewal,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("MOBILE LOGIN ERROR", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};