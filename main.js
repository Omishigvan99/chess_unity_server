const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");

// creating express instance
const app = express();
const httpServer = http.createServer(app);
const io = new socketIO.Server(httpServer, {
    // options
});

// configuring environment variables
dotenv.config();

// server listening
httpServer.listen(process.env.PORT || 8686, () => {
    console.log(`Server is running on PORT ${process.env.PORT || 8686}`);
});
