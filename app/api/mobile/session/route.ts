import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("__Secure-next-auth.session-token")?.value;
    if (!token) {
      return NextResponse.json(
        { authenticated: false, session: null },
        { status: 200 }
      );
    }

    const user = await User.findOne({ sessionToken: token }).lean();
    if (!user) {
      return NextResponse.json(
        { authenticated: false, session: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        session: {
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
    console.log("MOBILE SESSION ERROR", err);
    return NextResponse.json({ authenticated: false, session: null });
  }
}