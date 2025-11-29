export const API_URL = "https://u2userver.onrender.com";

export async function getConversations(userId: string) {
    const res = await fetch(`${API_URL}/conversations/${userId}`);
    const data = await res.json();
    return data;
};

export async function getConversationMessages(id: string) {
    const res = await fetch(`${API_URL}/conversation/${id}`);
    const data = await res.json();
    return data;
};