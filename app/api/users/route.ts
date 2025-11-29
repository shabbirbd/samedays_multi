
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const newUser = await request.json();
    await connectDB();
    const newDbUser = new User(newUser);
    const savedUser = await newDbUser.save();
    if (!savedUser) {
      return new Response(JSON.stringify("Failed to save user..."), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify(savedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      message: 'Failed to save user',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

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
    return new Response(JSON.stringify(users), {
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

export async function DELETE(req: Request) {
  await connectDB();
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({
        message: "Missing required email",
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const user = await User.findOne({ email: email });
    if (user.verified) {
      return new Response(JSON.stringify({
        message: 'No need to delete',
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      const deletedUser = await User.findOneAndDelete({ email: email });
      if (!deletedUser) {
        return new Response(JSON.stringify({
          message: 'user not found',
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        return new Response(JSON.stringify({
          message: 'User deleted successfully',
          model: deletedUser
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
  } catch (error: any) {
    return new Response(JSON.stringify({
      message: 'Failed to delete user',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export async function PUT(req: Request) {
  await connectDB();
  try {
    const { email, updates } = await req.json();
    if (!email || !updates) {
      return new Response(JSON.stringify({
        message: "Missing required email or updates",
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const updatedUser = await User.findOneAndUpdate({ email }, { name: updates.name, phone: updates.phone, businessAddress: updates.businessAddress }, { new: true });
    if (!updatedUser) {
      return new Response(JSON.stringify({
        message: 'User not found',
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      message: 'Failed to update user',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};