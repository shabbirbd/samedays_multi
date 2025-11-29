import mongoose, { Document, Model } from 'mongoose';

interface IResetToken extends Document {
  email: string,
  token: string,
  expiresAt: Date
};

const ResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
},{
    timestamps: true
});

const ResetToken: Model<IResetToken> = mongoose.models?.ResetToken || mongoose.model<IResetToken>('ResetToken', ResetTokenSchema);

export default ResetToken;