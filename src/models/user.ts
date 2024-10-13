import { Schema, model, Document } from "mongoose";

// Interface representation of User document object
export interface IUser extends Document{
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  is_verified: boolean;
  password: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  userName: {type: String, required: true, unique: true},
  firstName: {type: String},
  lastName: {type: String},
  email: {type: String, required: true, unique: true},
  is_verified: {type: Boolean, required: true, default: false},
  password: {type: String, required: true},
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const User = model<IUser>('User', UserSchema);

export default User;
