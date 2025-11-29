import mongoose, { Document, Model } from 'mongoose';

interface ITeammate extends Document {
    userId: string,
    email: string,
    expiary: string,
    seat: string,
    status: string,
    name?: string,
    copilot?: string, 
    token: string
}

const TeammateSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    expiary: { type: String, required: true },
    seat: { type: String, required: true },
    status: { type: String, required: true },
    name: { type: String, required: false },
    copilot: { type: String, required: false },
    token: { type: String, required: true },
}, {
    timestamps: true
});

const Teammate: Model<ITeammate> = mongoose.models?.Teammate || mongoose.model<ITeammate>('Teammate', TeammateSchema);

export default Teammate;