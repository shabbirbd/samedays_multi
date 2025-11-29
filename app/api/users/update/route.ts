import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        const { name, image, phone, userId } = await request.json();

        if (!userId || !name) {
            return new Response(JSON.stringify({
                message: "Missing required fields: userId and name are required"
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        await connectDB();
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { name: name, image: image, phone: phone } },
            { new: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({
                message: "Failed to update user: user not found."
            }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        return new Response(JSON.stringify(updatedUser), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            message: 'Failed to update user',
            error: error?.message ?? String(error)
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}