import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the document
export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  image?: string;
  verified: boolean;
  phone?: string;
  plan?: string;
  renewal?: string;
}

// Define the schema
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  phone: {
    type: String,
    required: false,
  },
  plan: {
    type: String,
    requird: false
  },
  renewal: {
    type: String,
    required: false
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

// Create and export the model
const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default User;
