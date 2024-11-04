import dotenv from 'dotenv';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redisClient from '../services/RedisServices';
import AuthService from '../services/AuthServices';


dotenv.config();

export const authenticateAccessToken = (req: any, res: any, next: NextFunction) => {

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).send({ error: 'Access token required' });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).send({ error: 'Invalid or expired access token' });
  }
};

export const authenticateRefreshToken = async (req: any, res: any, next: NextFunction) => {

  const refreshToken = req.body.token;
  
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  try {
    const decodedValue: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY!);
    const storedToken = await redisClient.get(decodedValue._id)

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(400).json({ error: 'Invalid or expired refresh token' });
    }

    const newAccessToken = AuthService.generateAccessToken(decodedValue.id, decodedValue.name);
    const newRefreshToken = AuthService.generateRefreshToken(decodedValue.id, decodedValue.name);

    await AuthService.storeRefreshTokenInRedis(decodedValue.id, newRefreshToken);

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }

}
