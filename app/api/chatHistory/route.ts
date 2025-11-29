"use server"

import connectDB from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';

export async function POST(req: Request,) {
    const data = await req.json()
    await connectDB();

    try {
        const newHistory = new ChatHistory(data);

        const savedHistory = await newHistory.save();
        return new Response(JSON.stringify(savedHistory), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            message: 'Failed to save history',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};


export async function GET(req: Request) {
    await connectDB();

    try {
        const histories = await ChatHistory.find({});
        return new Response(JSON.stringify(histories), {
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


export async function PUT(req: Request) {
    await connectDB();

    try {
        const { historyId, newHistory } = await req.json()
        if (!historyId || !newHistory) {
            return new Response(JSON.stringify({
                message: "Missing required historyId or updates",
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const updatedHistory = await ChatHistory.findByIdAndUpdate(historyId, newHistory, { new: true });
        if (!updatedHistory) {
            return new Response(JSON.stringify({
                message: 'Agent not found',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify(updatedHistory), {
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

export async function DELETE(req: Request) {
    await connectDB();

    try {
        const { historyId } = await req.json();
        if (!historyId) {
            return new Response(JSON.stringify({
                message: "Missing required historyId",
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const deletedHistory = await ChatHistory.findByIdAndDelete(historyId);
        if (!deletedHistory) {
            return new Response(JSON.stringify({
                message: 'History not found',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify({
            message: 'History deleted successfully',
            agent: deletedHistory
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to delete history',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};