import mongoose, { Document, Model } from 'mongoose';

interface IAudioData extends Document {
    userId: string,
    url: string,
    location: string,
    coordinates: string
}

const AudioDataSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    url: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: { type: String, required: true },
}, {
    timestamps: true
});

const AudioData: Model<IAudioData> = mongoose.models?.AudioData || mongoose.model<IAudioData>('AudioData', AudioDataSchema);

export default AudioData;