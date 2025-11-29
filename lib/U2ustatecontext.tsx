"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "./u2usocket";
import { getConversationMessages, getConversations } from "./u2uapi";
import { useSearchParams } from "next/navigation";


interface CustomSession {
    user: {
        email: string;
        id: string;
        name: string;
        image: string;
        verified: boolean;
    };
};

const U2uStateContext = createContext(null);

export const U2uStateProvider = ({ children }) => {
    const { data: session, update } = useSession() as {
        data: CustomSession,
        update: (data?: any) => Promise<Session | null>
    };
    const user = session?.user;
    const searchParams = useSearchParams();
    const defaultConvId = searchParams.get('conv');
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState<any>(null);
    const [messages, setMessages] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [messageLoading, setMessageLoading] = useState(false);

    // === SET CURRENT ACTIVE CONVERSATION ===
    useEffect(() => {
        if (defaultConvId?.length > 0) {
            if (conversations?.length > 0) {
                const currentConv = conversations.find((item) => item._id === defaultConvId);
                if (currentConv) {
                    setActiveConversation(currentConv);
                } else {
                    setActiveConversation(null);
                    setMessages([]);
                }
            } else {
                setActiveConversation(null);;
                setMessages([]);
            }
        } else {
            setActiveConversation(null);
            setMessages([]);
        }
    }, [defaultConvId, conversations]);

    // === CONNECT USER TO SOCKET ===
    useEffect(() => {
        if (!user) return;
        socket.emit("join", user?.id);
    }, [user]);

    // === LOAD CONVERSATIONS ON START ===
    const getAllConversations = async () => {
        if(!user) return;
        const data = await getConversations(user.id);
        setConversations(data);
    };

    useEffect(() => {
        if (!user) return;
        async function loadData() {
            getAllConversations();
        }
        loadData();
    }, [user]);


    // === LOAD MESSAGES OF ACTIVE CONVERSATION ===
    useEffect(() => {
        if (!activeConversation?._id) return;
        async function loadMessages() {
            setMessageLoading(true);
            const conv = await getConversationMessages(activeConversation._id);
            setMessages(conv.messages);
            setMessageLoading(false);
        }
        loadMessages();
    }, [activeConversation]);


    // === REAL-TIME RECEIVING MESSAGE ===
    useEffect(() => {
        socket.on("receiveMessage", ({ conversationId, message }) => {
            getAllConversations();
            if (activeConversation?._id === conversationId) {
                setMessages((prev) => [...prev, message]);
            }
            setConversations((prev) =>
                prev.map((c) =>
                    c._id === conversationId
                        ? { ...c, messages: [...c.messages, message] }
                        : c
                )
            );
        });
        return () => {
            socket.off("receiveMessage");
        };
    }, [activeConversation, user]);


    // === SEND MESSAGE ===
    const sendMessage = (text: string, media?: any) => {
        if (!activeConversation) return;
        socket.emit("sendMessage", {
            conversationId: activeConversation._id,
            members: activeConversation.members,
            senderId: user.id,
            text,
            media,
        });
        getAllConversations();
    };

    // === START NEW CONVERSATION ===
    const startConversationWithUser = (otherUser) => {
        let conv = conversations.find((c) =>
            c.members.some((m) => m.id === otherUser.id)
        );
        if (!conv) {
            const newConv = {
                _id: "new",
                members: [user, otherUser],
                messages: [],
                isGroup: false,
            };
            setConversations((prev) => [newConv, ...prev]);
            setActiveConversation(newConv);
        } else {
            setActiveConversation(conv);
        }
    };

    //  === SEEN UPDATE ===
    useEffect(() => {
        if(!socket || !activeConversation || !user) return;
        socket.emit("seen", { conversationId: activeConversation._id, userId: user?.id });
    }, [socket, activeConversation, user]);


    const value = {
        user,
        conversations,
        activeConversation,
        messages,
        setMessages,
        setActiveConversation,
        sendMessage,
        startConversationWithUser,
        searchResults,
        setSearchResults,
        getAllConversations,
        messageLoading,
        setMessageLoading
    };

    return (
        <U2uStateContext.Provider value={value} >
            {children}
        </U2uStateContext.Provider>
    )
};

export const useU2uState = () => {
    const context = useContext(U2uStateContext);
    if (!context) {
        throw new Error('Chat provider is not ready.')
    }
    return context;
};