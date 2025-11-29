import mongoose, { Document, Model } from 'mongoose';

interface IRealtimeTranscript extends Document {
  userId: string,
  userEmail: string,
  userName?: string,
  transcript: any []
};

const RealtimeTranscriptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: false },
  transcript: {type: Array, required: true}
},{
    timestamps: true
});

const RealtimeTranscript: Model<IRealtimeTranscript> = mongoose.models?.RealtimeTranscript || mongoose.model<IRealtimeTranscript>('RealtimeTranscript', RealtimeTranscriptSchema);

export default RealtimeTranscript;