import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        );
        console.log(
            `Mongo DB Connected successfully... ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("Unable to connect with MongoDB: ", error);
        process.exit(1);
    }
};

export default connectDB;
