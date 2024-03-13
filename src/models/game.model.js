import mongoose from "mongoose";
const gameSchema = new mongoose.Schema(
    {
        roomId: {
            type: String, //socket id
            required: true,
        },
        player1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "player",
            required: true,
        },
        player2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "player",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "ongoing", "completed"],
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "player",
        },
        moves: {
            type: Array,
            default: [],
        },

    },
    { timestamps: true }
);

export const Game = mongoose.model("Game", gameSchema);
