import jwt, { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import UserService from "../services/UserServices";
import { IUser } from "../models/user";
import { Document } from "mongoose";

dotenv.config();
const SECRET_KEY = process.env.SECRET

// interface

class AuthService {
  /**
   * AuthService class handles all interactions with the database as regards Authentication
   */
  static async authenticate(password: string, userNameOrEmail: string) {

    if (!userNameOrEmail) { throw new Error('Username or Email expected'); }

    let user;

    user = await UserService.getUser(userNameOrEmail);

    const hashed_password: string = user!.password;
    bcrypt.compare(password, hashed_password, (err, result) => {

      if (err) { throw new Error(`${err}`) }

      // result is either true or false
      if (result) { return user }
      else { throw new Error('Invalid password'); }

    });
  }

  static login<loginResponse> (user: any) {

    const name: string = user.firstName || user.userName;

    const id: string = user._id!?.toString();

    const token: string = jwt.sign({ _id: id, name: user.userName }, SECRET_KEY!, {
      expiresIn: '1 day',
    });

    const result = {
      user: {
        _id: id,
        name: name
      },
      token: token
    }

    return result;
  }
}

export default AuthService;
