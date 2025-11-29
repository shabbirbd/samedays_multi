import connectDB from "@/lib/mongodb";
import ChatHistory from "@/models/ChatHistory";


export async function GET(req: Request, context: any) {
    await connectDB();
    const { params } = context;
    const convId = (await params).convId;

    try {
        const conv = await ChatHistory.findById(convId);
        if(conv) {
            return new Response(JSON.stringify(conv), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({message: 'Conversation not found'}), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
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