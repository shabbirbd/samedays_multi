"use server"

import connectDB from "@/lib/mongodb";
import Teammate from "@/models/Teammate";

export async function POST(req: Request) {
    const data = await req.json();
    await connectDB();

    if (!Array.isArray(data) || data.length === 0) {
        return new Response(JSON.stringify({
            message: 'Input must be a non-empty array of teammates',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    try {
        const savedMembers = await Teammate.insertMany(data);
        return new Response(JSON.stringify(savedMembers), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            message: 'Failed to save teammates',
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
        const teamMembers = await Teammate.find({});
        return new Response(JSON.stringify(teamMembers), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to retrieve teamMembers',
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
        const { memberId, newMember } = await req.json()
        if (!memberId || !newMember) {
            return new Response(JSON.stringify({
                message: "Missing required parameters",
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const updatedTeamMember = await Teammate.findByIdAndUpdate(memberId, newMember, { new: true });
        if (!updatedTeamMember) {
            return new Response(JSON.stringify({
                message: 'Member not found',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify(updatedTeamMember), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to update member',
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
        const { memberId } = await req.json();
        if (!memberId) {
            return new Response(JSON.stringify({
                message: "Missing required parameter",
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const deletedTeamMember = await Teammate.findByIdAndDelete(memberId);
        if (!deletedTeamMember) {
            return new Response(JSON.stringify({
                message: 'team member not found',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify({
            message: 'Team member deleted successfully',
            deletedItem: deletedTeamMember
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to delete team member',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};