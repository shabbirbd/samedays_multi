import connectDB from "@/lib/mongodb";
import Teammate from "@/models/Teammate";


export  async function GET(req: Request, context: any) {
    await connectDB(); 
    const { params } = context;
    const userId = (await params).userId as string;
    
    if (req.method === 'GET') {
      try {
        const teamMembers = await Teammate.find({userId: userId});  
        return new Response(JSON.stringify(teamMembers), {
            status: 200, 
            headers: {
                'Content-Type': 'application/json' 
            }
        });
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        return new Response(JSON.stringify({
            message: 'Failed to retrieve team members',
            error: error.message
        }), {
            status: 500, 
            headers: {
                'Content-Type': 'application/json' 
            }
        });
      }
    } else {
        return new Response('Method Not Allowed', {
            status: 405, 
            headers: {
                'Allow': 'GET' 
            }
        });
    }
}