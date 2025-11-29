import mongoose, { Document, Model } from 'mongoose';

interface IChatHistory extends Document {
    userId: string,
    title?: string,
    responses?: any [],
    agentId?: string,
    pinned?: boolean,
}

const chatHistorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: false, default: 'Untitled'},
    responses: { type: Array, required: false },
    agentId: {type: String, required: false},
    pinned: {type: Boolean, required: false, default: false}
}, {
    timestamps: true
});

const ChatHistory: Model<IChatHistory> = mongoose.models?.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', chatHistorySchema);

export default ChatHistory;