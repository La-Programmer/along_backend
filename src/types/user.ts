export interface IUser extends Document{
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  is_verified: boolean;
  role: string;
  password: string;
  confirmPassword: string | undefined;
  created_at: Date;
  updated_at: Date;
}

export interface IUserCreation {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
};