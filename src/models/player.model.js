import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        rank: {
            type: Number,
            default: 0,
        },
        games: {
            type: String,
            default: 0,
        },
        tournament: {
            type: String,
            default: 0,
        },

    },
    { timestamps: true }
);

export const Player = mongoose.model("Player", playerSchema);
