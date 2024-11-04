import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import UserService from "../services/UserServices";
import redisClient from "./RedisServices";

dotenv.config();
const SECRET_KEY = process.env.SECRET
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY

// interface

class AuthService {
  /**
   * AuthService class handles all interactions with the database as regards Authentication
  */ 
 static async authenticate(password: string, userNameOrEmail: string) {

    if (!userNameOrEmail) { throw new Error('Username or Email expected'); }

    try {
      const user = await UserService.getUser(userNameOrEmail)
      console.log("USER GOTTEN FROM DB", user)
      const hashed_password: string = user.password;
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

    if (!user.is_verified) {
      throw new Error("User is not verified, verify user's email")
    }

    const name: string = user.userName;

    const id: string = user._id!?.toString();

    try {
      const accessToken: string = AuthService.generateAccessToken(id, name);
      const refreshToken: string = AuthService.generateRefreshToken(id, name);
      AuthService.storeRefreshTokenInRedis(id, refreshToken);
      user = {
        id: id,
        name: name
      }
      console.log('USER', user);
      const result = {
        ...user,
        accessToken: accessToken,
        refreshToken: refreshToken
      }

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static generateAccessToken(userId: string, userName: string) {
    /**
     * Generate an access token for the user
     * @user the mongo document of the user in question
     * @return {string} the access token
     */
    const accessToken: string = jwt.sign({ _id: userId, name: userName }, ACCESS_TOKEN_SECRET_KEY!, {
      expiresIn: '1 hour',
    });
    return accessToken;
  }

  static generateRefreshToken(userId: string, userName: string) {
    /**
     * Generate an refresh token for the user
     * @user the mongo document of the user in question
     * @return {string} the refresh token
     */
    const refreshToken: string = jwt.sign({ _id: userId, name: userName }, REFRESH_TOKEN_SECRET_KEY!, {
      expiresIn: '1d',
    });
    return refreshToken;
  }

  static async storeRefreshTokenInRedis(userId: any, refreshToken: string) {
    /**
     * Store refresh token in Redis
     * @refreshToken {string} token to store in redis
     * @return {undefined} None
     */
    const key: string = `refreshToken:${userId}`;
    await redisClient.set(key, refreshToken, (24 * 60 * 60))
  }

  static async getRefreshTokenFromRedis(userId: string) {
    /**
     * Get the refresh token from Redis
     * @userId {string} id used as the key for storing the token
     * @return {string} refresh token 
     */
    const key: string = `refreshToken:${userId}`;
    const refreshToken: string = await redisClient.getAsync(key);
    return refreshToken || null;
  }

  static async deleteRefreshTokenFromRedis(userId: string) {
    /**
     * Delete the refresh token from Redis
     * @userId {string} id used as the key for storing the token
     * @return {undefined} None 
     */
    const key: string = `refreshToken:${userId}`;
    await redisClient.del(key);
  }
}

export default AuthService;
