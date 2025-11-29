
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

export async function POST(request: Request) {
  try {
    const { newMessage } = await request.json();

    console.log(newMessage, '...new')
    
    await connectDB();
    const newDbMessage = new Message(newMessage);
    const savedMessage = await newDbMessage.save();
    if (!savedMessage) {
      return new Response(JSON.stringify("Failed to save message..."), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify(savedMessage), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      message: 'Failed to save message',
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
    const { messageId } = await req.json();
    if (!messageId) {
      return new Response(JSON.stringify({
        message: "Missing required messageId",
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
      const deletedMessage = await Message.findOneAndDelete({ messageId: messageId });
      if (!deletedMessage) {
        return new Response(JSON.stringify({
          message: 'Message not found',
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        return new Response(JSON.stringify({
          message: 'Message deleted successfully',
          model: deletedMessage
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
  } catch (error: any) {
    return new Response(JSON.stringify({
      message: 'Failed to delete Message',
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
    const { messageId, newMessage } = await req.json();
    if (!messageId || !newMessage) {
      return new Response(
        JSON.stringify({
          message: "Missing required messageId or newMessage",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updatedMessage = await Message.findOneAndUpdate(
      { messageId },
      { $set: newMessage },
      { new: true }
    );

    if (!updatedMessage) {
      return new Response(
        JSON.stringify({
          message: "Message not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify(updatedMessage), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to update Message",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}