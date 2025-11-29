import connectDB from "@/lib/mongodb";
import User from "@/models/User";


export async function GET(request: Request) {
    try {
        await connectDB();
        const users = await User.find({});
        if (!users) {
            return new Response(JSON.stringify("Failed to get user..."), {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        
        const formatedUsers = users.map((item) => {
            const {name, image, email, _id} = item;
            return {
                name, 
                image,
                email,
                _id
            }
        });

        return new Response(JSON.stringify(formatedUsers), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            message: 'Failed to retrieve users',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};