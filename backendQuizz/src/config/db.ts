import mongoose from "mongoose";
import * as dotenv from "dotenv";

// Load env  variables from  .env file
dotenv.config();

const connectedDb = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    // check if MONGO_URI is present otherwise throw an error
    if (!mongoUri) {
      console.error(
        "❌ MONGO_URI is missing or undefined in the .env file. Please verify your .env file to ensure the correct configuration."
      );
      // Exit the process immediately with failure code
      process.exit(1);
    }

    // Connect MongoDB using mongoose

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully!");

    // handle error after initial connection
    mongoose.connection.on("error", (err) => {
      console.log("Error after initial connection", err.message);
    });
    // handle disconnection
    mongoose.connection.on("disconnection", () => {
      console.error("MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error) {
    // Catch any connection failure and exit the process
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB", error.message);
    } else {
      console.error("An unexpected error occurred", error);
    }

    // Exit the process if the database connection fails
    process.exit(1); // Ensure we exit if the connection attempt fails
  }
};

export default connectedDb;
