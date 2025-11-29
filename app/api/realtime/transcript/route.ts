
import connectDB from '@/lib/mongodb';
import RealtimeTranscript from '@/models/RealtimeTranscript';
import { Realtime } from 'openai/resources/index.mjs';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    await connectDB();
    const newTranscript = new RealtimeTranscript(data);
    const savedTranscript = await newTranscript.save();
    if (!savedTranscript) {
      return new Response(JSON.stringify("Failed to save transcript..."), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify(savedTranscript), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      message: 'Failed to save transcript',
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
    const { transcriptId } = await req.json();
    if (!transcriptId) {
      return new Response(JSON.stringify({
        message: "Missing required parameters",
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
      const deletedTranscript = await RealtimeTranscript.findOneAndDelete({ transcriptId: transcriptId });
      if (!deletedTranscript) {
        return new Response(JSON.stringify({
          message: 'Transcript not found',
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        return new Response(JSON.stringify({
          message: 'Transcript deleted successfully',
          model: deletedTranscript
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
  } catch (error: any) {
    return new Response(JSON.stringify({
      message: 'Failed to delete Transcript',
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
    const { transcriptId, newTranscript } = await req.json();
    if (!transcriptId || !newTranscript) {
      return new Response(
        JSON.stringify({
          message: "Missing required parameters",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updatedTranscript = await RealtimeTranscript.findOneAndUpdate(
      { transcriptId },
      { $set: newTranscript },
      { new: true }
    );

    if (!updatedTranscript) {
      return new Response(
        JSON.stringify({
          message: "Transcript not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify(updatedTranscript), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to update Transcript",
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