import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  const response: any = await openai.chat.completions.create({
    model: 'gpt-4.1-nano',
    stream: true,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages,
    ],
    max_tokens: 20,
    temperature: 0.2,
  });
 
  const stream = await OpenAIStream(response);

  return new StreamingTextResponse(stream);
};


const systemPrompt = `You will be given a conversation snippet containing  'user' message and 'assistant' message. Your task is to create a 2 to 4 word title for this conversation.

**CRITICAL RULE:** The title MUST be generated based on the content of the 'user' message only. The 'assistant' message is just for context and should be ignored when creating the title.

**MUST FOLLOW**
-   Do NOT use quotation marks.
-   Respond with ONLY the title.

**Example:**
-   **User Message:** "What are the core differences between React's useEffect and useLayoutEffect hooks?"
-   **Assistant Message:** "Certainly. The main difference lies in the timing of their execution..."
-   **Correct Title:** React useEffect vs useLayoutEffect

Now, generate a title for the following conversation.`;