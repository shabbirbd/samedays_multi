"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useToast } from "./toastContext";


interface CustomSession {
    user: {
        email: string;
        id: string;
        name: string;
        image: string;
        verified: boolean;
    };
};

const RealtimeStateContext = createContext(null);

export const RealtimeStateProvider = ({ children }) => {
    const { data: session, update } = useSession() as {
        data: CustomSession,
        update: (data?: any) => Promise<Session | null>
    };
    const user = session?.user;
    const [connected, setConnected] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const lastResponseIdRef = useRef<string | null>(null);
    const isLiveRef = useRef(false);
    const lastTriggerIdRef = useRef<string | null>(null);
    const transcriptRef = useRef<
        { role: "user" | "assistant"; content: string; createdAt: string }[]
    >([]);
    const { addToast } = useToast();

    const handleSaveTranscript = async () => {
        if (transcriptRef?.current?.length < 1) return;
        console.log("Final Transcript:", transcriptRef.current);
        const newReport = {
            userId: user?.id,
            userEmail: user?.email,
            userName: user?.name || '',
            responses: transcriptRef?.current
        };
        const response = await fetch(`/api/realtime/transcript`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReport)
        });
        if (response.ok) {
            addToast('Transcript stored successfully.', { type: 'success' });
        } else {
            addToast("Transcript couldn't be stored.", { type: 'error' });
        }
        transcriptRef.current = [];
    };

    const stopCall = useCallback(() => {
        dataChannelRef.current?.close();
        dataChannelRef.current = null;
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        if (remoteAudioRef.current) {
            remoteAudioRef.current.pause();
            remoteAudioRef.current.srcObject = null;
            remoteAudioRef.current = null;
        }
        lastResponseIdRef.current = null;
        isLiveRef.current = false;
        lastTriggerIdRef.current = null;
        setIsLive(false);
        setConnected(false);
        handleSaveTranscript()
    }, [user]);

    const sendDataChannelEvent = useCallback(
        (payload: Record<string, unknown>) => {
            const channel = dataChannelRef.current;
            if (channel?.readyState === "open") {
                channel.send(JSON.stringify(payload));
            }
        },
        [],
    );

    const handleServerEvent = (payload: any) => {
        switch (payload.type) {
            case "response.audio_transcript.done": {
                const finalAssistantText = payload.transcript || "";
                console.log("🤖:", finalAssistantText);
                transcriptRef.current.push({
                    role: "assistant",
                    content: finalAssistantText,
                    createdAt: new Date().toISOString()
                });

                break;
            }

            case "conversation.item.input_audio_transcription.completed": {
                const finalUserText = payload.transcript || "";
                console.log("👨🏼:", finalUserText);
                transcriptRef.current.push({
                    role: "user",
                    content: finalUserText,
                    createdAt: new Date().toISOString()
                });
            }

            default:
                break;
        }
    };

    const startCall = async () => {
        try {
            console.log("Call connecting");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            const pc = new RTCPeerConnection();
            peerConnectionRef.current = pc;
            const remoteAudio = document.createElement("audio");
            remoteAudio.autoplay = true;
            remoteAudioRef.current = remoteAudio;
            pc.ontrack = (event) => {
                if (event.track.kind === "audio" && remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = event.streams[0];
                }
            };
            const voice = "ash";
            const sendVoiceConfig = (channel: RTCDataChannel) => {
                const configMessage = {
                    type: "session.update",
                    session: {
                        voice: voice,
                        input_audio_format: "pcm16",
                        output_audio_format: "pcm16",
                        turn_detection: {
                            type: 'semantic_vad',
                            interrupt_response: true,
                            create_response: false
                        },
                        input_audio_transcription: {
                            model: "gpt-4o-mini-transcribe"
                        },
                    }
                };
                channel.send(JSON.stringify(configMessage));
            };
            stream.getAudioTracks().forEach((track) => pc.addTrack(track, stream));
            const dataChannel = pc.createDataChannel("oai-events");
            dataChannelRef.current = dataChannel;
            dataChannel.onopen = () => {
                sendVoiceConfig(dataChannel);
            };
            pc.ondatachannel = (event) => {
                const channel = event.channel;
                dataChannelRef.current = channel;
                channel.onopen = () => {
                    sendVoiceConfig(channel);
                };
            };
            pc.onconnectionstatechange = () => {
                if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
                    console.log("Call disconnected");
                    stopCall();
                }
            };
            dataChannel.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data);
                    handleServerEvent(payload);
                } catch (error) {
                    console.log("Error::::::", event.data);
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            const baseUrl = "https://api.openai.com/v1/realtime";
            const model = "gpt-4o-mini-realtime-preview";
            const sdpUrl = `${baseUrl}?model=${model}`;
            const sdpResponse = await fetch(sdpUrl, {
                method: "POST",
                body: offer.sdp ?? undefined,
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_REALTIME_KEY}`,
                    "Content-Type": "application/sdp",
                },
            });
            if (!sdpResponse.ok) {
                throw new Error("Failed to connect to OpenAI Realtime API");
            }
            const answer = {
                type: "answer",
                sdp: await sdpResponse.text(),
            };
            await pc.setRemoteDescription(answer as RTCSessionDescriptionInit);
            transcriptRef.current = [];
            isLiveRef.current = false;
            setIsLive(false);
            setConnected(true);
            console.log("Call connected, listening silently...");
        } catch (error) {
            console.error("Unable to start realtime session", error);
            stopCall();
        }
    };

    const toggleLive = () => {
        if (!connected) return;

        const newLive = !isLive;
        isLiveRef.current = newLive;
        setIsLive(newLive);

        // --- VAD OFF ---
        if (!newLive) {
            console.log("VAD OFF — still listening silently.");

            // Disable VAD
            sendDataChannelEvent({
                type: "session.update",
                session: {
                    turn_detection: {
                        type: 'semantic_vad',
                        interrupt_response: true,
                        create_response: false
                    },
                },
            });

            lastTriggerIdRef.current = null;
            return;
        }

        // --- VAD ON ---
        console.log("VAD ON — next speech will trigger replies.");

        sendDataChannelEvent({
            type: "session.update",
            session: {
                turn_detection: {
                    type: 'semantic_vad',
                    interrupt_response: false,
                    create_response: true
                },
            },
        });
    };

    const sendTextMessage = (text: string) => {
        if (!connected) {
            console.warn("Call not connected.");
            return;
        }
        sendDataChannelEvent({
            type: "conversation.item.create",
            item: {
                type: "message",      // REQUIRED
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text,              // the user's message
                    }
                ]
            }
        });

        sendDataChannelEvent({
            type: "response.create",
            response: {}
        });
        console.log("👨🏼:", text);
        transcriptRef.current.push({
            role: "user",
            content: text,
            createdAt: new Date().toISOString()
        });

        console.log("User text sent:", text);
        if (!isLiveRef.current) {
            console.log("Output disabled — text stored but no reply.");
            return;
        }
    };


    const value = {
        connected,
        isLive,
        peerConnectionRef,
        localStreamRef,
        remoteAudioRef,
        dataChannelRef,
        lastResponseIdRef,
        isLiveRef,
        lastTriggerIdRef,
        transcriptRef,
        stopCall,
        sendDataChannelEvent,
        startCall,
        toggleLive,
        sendTextMessage
    };

    return (
        <RealtimeStateContext.Provider value={value} >
            {children}
        </RealtimeStateContext.Provider>
    )
};

export const useRealtimeState = () => {
    const context = useContext(RealtimeStateContext);
    if (!context) {
        throw new Error('Chat provider is not ready.')
    }
    return context;
};