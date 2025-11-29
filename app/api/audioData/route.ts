import connectDB from '@/lib/mongodb';
import AudioData from '@/models/AudioData';

export async function POST(request: Request) {
  try {
    const newAudioData = await request.json();
    await connectDB();
    const newDbAudioData = new AudioData(newAudioData);
    const savedAudioData = await newDbAudioData.save();
    if (!savedAudioData) {
      return new Response(JSON.stringify("Failed to save audioData..."), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify(savedAudioData), {
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
    const audioDatas = await AudioData.find({});
    if (!audioDatas) {
      return new Response(JSON.stringify("Failed to get audio data..."), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify(audioDatas), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      message: 'Failed to retrieve audioDatas',
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
        const { audioDataId } = await req.json();
        if (!audioDataId) {
            return new Response(JSON.stringify({
                message: "Missing required parameters",
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const deletedAudioData = await AudioData.findByIdAndDelete(audioDataId);
        if (!deletedAudioData) {
            return new Response(JSON.stringify({
                message: 'Audio Data not found',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify({
            message: 'Audio Data deleted successfully',
            agent: deletedAudioData
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to delete audio data',
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
        const { audioDataId, neewAudioData } = await req.json()
        if (!audioDataId || !neewAudioData) {
            return new Response(JSON.stringify({
                message: "Missing required parameters",
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const updatedAudioData = await AudioData.findByIdAndUpdate(audioDataId, neewAudioData, { new: true });
        if (!updatedAudioData) {
            return new Response(JSON.stringify({
                message: 'Agent not found',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify(updatedAudioData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to update history',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};