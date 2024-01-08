import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});

import app from "./app.js";
import connectDB from "./db/database.js";

const port = process.env.PORT || 4000;
// connect to the DB
connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Application Unable to connect with DB: ", error);
            throw error;
        });

        app.listen(port, () => {
            console.log(`Server is listen at the port ${port}`);
            console.log(`http://localhost:3000/`);
        });
    })
    .catch((error) => {
        console.log("Unable to connect with DB...", error);
        process.exit(1);
    });
