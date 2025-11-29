import mongoose, { Document, Model } from 'mongoose';

interface IMessage extends Document {
    userId: string,
    sid: string,
    body: string,
    from: string,
    to: string,
    type: string
}

const MessageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    sid: { type: String, required: true },
    body: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    type: { type: String, required: true },
}, {
    timestamps: true
});

const Message: Model<IMessage> = mongoose.models?.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;