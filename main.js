const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");

// creating express instance
const app = express();
const httpServer = http.createServer(app);
const io = new socketIO.Server(httpServer, {
    cors: {
        origin: "*",
    },
});

// configuring environment variables
dotenv.config();

io.on("connection", (socket) => {
    console.log("Client:", socket.id);

    socket.on("message", (message) => {
        console.log(message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log("SocketID:", socket.id, " Room: ", room);
    });

    socket.on("move", (move, room) => {
        console.log(move, room);
        socket.to(room).emit("move", move);
    });

    socket.on("disconnection", (socket) => {
        console.log(`${socket.id} got disconnected`);
    });
});

// server listening
httpServer.listen(process.env.PORT || 8686, () => {
    console.log(`Server is running on PORT ${process.env.PORT || 8686}`);
});
