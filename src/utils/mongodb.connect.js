import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose.set("strictQuery", false);

if (process?.env?.MONGO_URI || false) {
  await mongoose.connect(process.env.MONGO_URI);
  console.info("Local MongoDB connected!");
} else {
  console.error("No MongoDB URI was found.");
}
