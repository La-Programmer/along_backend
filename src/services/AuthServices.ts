import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import UserService from "../services/UserServices";
import { IUser } from "../types/user";

dotenv.config();
const SECRET_KEY = process.env.SECRET

// interface

class AuthService {
  /**
   * AuthService class handles all interactions with the database as regards Authentication
   */
  static async authenticate(password: string, userNameOrEmail: string) {

    if (!userNameOrEmail) { throw new Error('Username or Email expected'); }

    try {
      const user = await UserService.getUser(userNameOrEmail)
      const hashed_password: string = user!.password;
      bcrypt.compare(password, hashed_password, (err, result) => {
        if (err) { throw new Error(`${err}`) }
        
        // result is either true or false
        if (result) {
          return user;
          }
        else { throw new Error('Invalid password'); }
      });
      console.log('USER2', user);
      return user;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message)
    }
  }

  static login (user: any) {

    if (!user) {
      throw new Error("User not found")
    }

    const name: string = user.email !== undefined ? user.email : user.userName;

    const id: string = user._id!?.toString();

    const accessToken: string = jwt.sign({ _id: id, name: user.userName }, SECRET_KEY!, {
      expiresIn: '1 hour',
    });
    const refreshToken: string = jwt.sign({ _id: id, name: user.userName }, SECRET_KEY!, {
      expiresIn: '1 day',
    });

    user = {
      id: id,
      name: name
    }
    console.log('USER', user);
    const result = {
      ...user,
      accessTokentoken: accessToken,
      refreshToken: refreshToken
    }

    return result;
  }
}

export default AuthService;
