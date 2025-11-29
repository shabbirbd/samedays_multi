import connectDB from "@/lib/mongodb";
import ChatHistory from "@/models/ChatHistory";


export async function GET(req: Request, context: any) {
    await connectDB();
    const { params } = await context;
    const userId = (await params).userId;

    try {
        const history = await ChatHistory.find({ userId: userId });
        return new Response(JSON.stringify(history), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to retrieve histories',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};