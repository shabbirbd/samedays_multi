import connectDB from "@/lib/mongodb";
import User from "@/models/User";


export async function GET(request: Request, context: any) {
  const { params } = context;
  const email = (await params).email as string;
  
  if (!email) {
    return new Response(JSON.stringify({ message: "Email parameter is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  await connectDB()
  try {
    const user = await (User as any).findOne({ email: email })
    if (!user) {
      return new Response(JSON.stringify({ message: "Faild to get user..." }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      })
    }
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error : any) {
    return new Response(JSON.stringify(error.message), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
};