import dbConnect from "@/lib/mongodb";
import Teammate from "@/models/Teammate";

export async function POST(req: Request,) {
    try {
        await dbConnect();
        const {token, email} = await req.json();

        const teamMember = await Teammate.findOne({token: token, email: email});
        
        if(!teamMember) {
            return new Response(JSON.stringify({message: 'Failed to find'}), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify(teamMember), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to to find team member',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};