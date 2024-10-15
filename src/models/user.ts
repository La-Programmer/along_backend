import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/user";

const UserSchema: Schema<IUser> = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: [true, "Kindly provide a valid email"],
    unique: true,
  },
  is_verified: {
    type: Boolean,
    required: true,
    default: false
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'blogger', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, "Kindly provide a strong password"]
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const User = model<IUser>('User', UserSchema);

export default User;
