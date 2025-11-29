import connectDB from "@/lib/mongodb";
import ResetToken from "@/models/ResetToken";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID2,
    process.env.GOOGLE_CLIENT_SECRET2
);

export async function POST(req: Request,) {
    const { email } = await req.json();
    await connectDB();

    try {
        await ResetToken.deleteMany({ email: email });
        const token = generateRandomCode(45);
        const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);
        const newToken = new ResetToken({
            email: email,
            token: token,
            expiresAt: expiresAt
        });
        await newToken.save();

        const sender = await handleConnection();

        const body = `<div style="width: 100%; text-align: left;">
                            <div style="display: inline-block; padding-top: 22px; padding-bottom: 22px; padding-left: 20px; padding-right: 20px;">
                                <p style="text-align: left; margin-bottom: 13px; color: #353740" >Hello,</p>

                                <p style="margin-bottom: 13px; font-size: 13px; line-height: 18px; color: #353740; text-align: left;">Follow this link to reset your Samedays password for your <span style="color: #1155cc;">${email}</span> account.</p>

                                <div style="width: fit-content; margin-bottom: 13px;">
                                    <a href='${process.env.BASE_URL}?mode=reset_password&token=${token}' style=" font-size: 13px; line-height: 18px; color: #1155cc; text-align: left;">${process.env.BASE_URL}?mode=reset_password&token=${token}</a>
                                </div>

                                <p style="text-align: left; margin-bottom: 13px; color: #353740" >If you didn't ask to reset your password, you can ignore this email.</p>
                                <p style="text-align: left; margin-bottom: 13px; color: #353740" >Thanks,</p>
                                <p style="text-align: left; margin-bottom: 13px; color: #353740" >Your Samedays team</p>

                            </div>
                        </div>`;

        const rawMessage = [
            `From: <Samedays>`,
            `To: ${email}`,
            `Subject: =?utf-8?B?${Buffer.from('Reset your password for Samedays').toString('base64')}?=`,
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
    } catch (error: any) {
        return new Response(JSON.stringify({
            message: 'Failed to to send email',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

// helper function
const handleConnection = async () => {
    oauth2Client.setCredentials({ refresh_token: process.env.FOUNDER_REFRESH_TOKEN });
    const newTokens = await oauth2Client.refreshAccessToken();
    const newAccessToken = newTokens.credentials.access_token;
    oauth2Client.setCredentials({ access_token: newAccessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    return gmail
};

const generateRandomCode = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};