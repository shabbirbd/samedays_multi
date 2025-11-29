import { NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'edge';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No audio file provided.' },
                { status: 400 }
            );
        }
        const transcription = await openai.audio.transcriptions.create({
            model: 'whisper-1',
            file: file,
        });

        const transcribedText = transcription.text;

        return NextResponse.json({ text: transcribedText });

    } catch (error) {
        console.error('Error transcribing audio:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json(
            { error: 'Failed to transcribe audio', details: errorMessage },
            { status: 500 }
        );
    }
};