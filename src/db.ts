/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
// Load environment variables
// Import libraries
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_CONNECTION: string = process.env.DB_URL as string;
const DB_NAME: string = process.env.DB_NAME as string;

// MongoDB connection configuration
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: DB_NAME,
};

export const connect = async (): Promise<mongoose.Mongoose | null> => {
  try {
    const database: mongoose.Mongoose = await mongoose.connect(DB_CONNECTION, config);
    const name = database.connection.name;
    const host = database.connection.host;
    console.log(`Connected to database ${name} on host ${host}`);

    return database;
  } catch (error) {
    console.error(error);
    console.log("Connection error, trying to reconnect in 5s...");
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(connect, 5000);

    return null;
  }
};
