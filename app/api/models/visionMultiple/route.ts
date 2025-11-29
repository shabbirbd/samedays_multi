import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { imageUrls, prompt } = await request.json();

    const imageParts = imageUrls.map((url: string) => ({
      type: "image_url" as const,
      image_url: {
        url: url,
      }, 
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...imageParts,
          ],
        },
      ],
    });

    const data = response.choices[0];

    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error("Error in visionMultiple route:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request." }),
      { status: 500 }
    );
  }
};