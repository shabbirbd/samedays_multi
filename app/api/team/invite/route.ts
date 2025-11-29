import connectDB from "@/lib/mongodb";
import { google } from "googleapis";


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID2,
    process.env.GOOGLE_CLIENT_SECRET2
);

export async function POST(req: Request,) {
    try {
        await connectDB();
        const { userName, newTeammates } = await req.json();

        const sender = await handleConnection();

        const body = `
              <div style="max-width:678px;margin:0 auto;font-family:'Inter Variable',-apple-system,BlinkMacSystemFont,'San Francisco','Segoe UI',Roboto,'Helvetica Neue',sans-serif;color:#000;background-color:#fff;padding:40px 24px;">
    
                <div style="text-align:left;margin-bottom:22px;">
                    <img src="https://files.edgestore.dev/iay303qdo67jl7m2/publicFiles/_public/79fcc5c4-8a0d-46a2-8d1e-7d7c42ef0880.png" alt="Intercom" width="auto" height="32px" style="display:block;margin:0" />
                </div>

                <div style="border:1px solid #e5e5e5;border-radius:8px;padding:32px;width:100%;margin:0 auto;">
                
                    <div style="margin-bottom:16px;display:flex;align-items:center;">
                        <div style="background-color:#286efa;color:#fff;width:48px;height:48px;min-width:48px;min-height:48px;border-radius:50%;text-align:center;margin-right:12px;">
                            <p style="font-size:18px;line-height:24px;font-weight:600;color:#fff;margin:12px 0;">${userName.charAt(0).toUpperCase()}</p>
                        </div>
                        <div style="font-weight:600;font-size:18px;line-height:24px;margin-top:12px;">
                        Your teammate has invited you to join their team on Samedays.
                        </div>
                    </div>

                    <p style="margin:0 0 24px 0;font-size:14px;line-height:22px;">
                        Hi there,<br><br>
                        Your teammate has invited you to join their workspace. You've been assigned a <strong>${newTeammates[0]?.seat} seat</strong> (${newTeammates[0]?.seat === 'admin' ? 'complete platform access' : 'limited platform access'}).
                    </p>

                    <a href="${process.env.BASE_URL}/onboarding?teamInvite=${newTeammates[0].token}"
                        target="_blank"
                        style="display:inline-block;background-color:#000;color:#fff;text-decoration:none;font-weight:600;font-size:14px;line-height:20px;border-radius:6px;padding:10px 22px;">
                        Join your team
                    </a>

                    <div style="margin:32px 0 20px;text-align:left;color:#555;font-size:13px;line-height:20px;">
                        <h4 style="margin:0 0 6px 0;font-size:14px;font-weight:600;">What is Samedays?</h4>
                        <p style="margin:0;">
                            Samedays is an AI-powered, automation-first platform that helps your team deliver better support, scale efficiently, and keep customers happy.
                        </p>
                    </div>
                </div>
            </div>
            `;

        const memberEmails = newTeammates?.map((item) => item.email);
        const emailList = memberEmails?.join(', ');

        const rawMessage = [
            `From: <${userName} via Samedays>`,
            `To: ${emailList}`,
            `Subject: =?utf-8?B?${Buffer.from(`Your teammate has invited you to work together on Samedays`).toString('base64')}?=`,
            `Content-Type: text/html; charset="UTF-8"`,
            '',
            body
        ].join('\n');

        const encodedMessage = Buffer.from(rawMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const sentData = await sender.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });

        if (sentData.status === 200) {
            return new Response(JSON.stringify(sentData), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({
                message: 'Failed to to send email',
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.log(error, '.....error...')
        return new Response(JSON.stringify({
            message: 'Failed to to send invite',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};


const handleConnection = async () => {
    oauth2Client.setCredentials({ refresh_token: process.env.FOUNDER_REFRESH_TOKEN });
    const newTokens = await oauth2Client.refreshAccessToken();
    const newAccessToken = newTokens.credentials.access_token;
    oauth2Client.setCredentials({ access_token: newAccessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    return gmail
};