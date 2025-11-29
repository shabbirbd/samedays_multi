export async function POST(req: Request) {
    const agent = await req.json();
  
    try {
      const body = {
          persona_id: agent?.personaId,
          replica_id: agent?.replicaId,
          conversation_name: `FaceTime with ${agent?.shortName}`,
          conversational_context: agent?.systemPrompt,
          custom_greeting: `Hello, Welcome to Samedays. ${agent?.shortName} here. How can I help you?`,
          callback_url: 'https://vendor.com/api/videoTools/conversation/faceTime/webhook',
          properties: {
            max_call_duration: 120,
            participant_left_timeout: '02',
            participant_absent_timeout: '60',
          }
      };
  
      const res = await fetch(`https://tavusapi.com/v2/conversations`, {
        method: "POST",
        headers: {
          'x-api-key': process.env.TAVAS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      const data = await res.json();
  
      return new Response(JSON.stringify(data), {
        status: 200,
      });
    } catch (error) {
      console.log(error,'....error...')
      return new Response("Failed to retrieve access token", {
        status: 500,
      });
    }
  };