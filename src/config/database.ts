import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri: string = process.env.MONGO_URL! 

const connectToDb  = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the DB");

    const collections = await mongoose.connection.db!.listCollections().toArray();
    console.log('Collections in the database:', collections);

  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export default connectToDb;
