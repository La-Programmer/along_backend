import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';

dotenv.config();

const apiKey: string = process.env.MONGO_URL! 

mongoose
  .connect(apiKey)
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(err));
