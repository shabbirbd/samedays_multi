
import connectDB from "@/lib/mongodb";
import ResetToken from "@/models/ResetToken";
import User from "@/models/User";


export async function POST(req: Request,) {
    const { token, password } = await req.json();
    await connectDB();

    try {
        const tokenData = await ResetToken.findOne({ token: token })

        if (!tokenData) {
            return new Response(JSON.stringify({ error: "Invalid request." }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const now = new Date().getTime();
        const expiary = new Date(tokenData.expiresAt).getTime();

        if (now > expiary) {
            return new Response(JSON.stringify({ error: "Token expired. Please resend the recovery email." }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        const email = tokenData.email;
        const updatedUser = await User.findOneAndUpdate({ email: email }, { password: password });
        if (updatedUser) {
            await ResetToken.deleteMany({ email: email });
        } else {
            return new Response(JSON.stringify({ error: "Failed to update user password." }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        return new Response(JSON.stringify({ message: "OK" }), {
            status: 200
        })
    } catch (error: any) {
        return new Response(JSON.stringify({
            error: 'Internal server error. Please try again.',
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};