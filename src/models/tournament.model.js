import mongoose from "mongoose";
const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["knockout", "round robin"],
    },
    hostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["registrations On", "registrations Off", "ongoing", "completed"],
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
        },
    ],
    rounds: [
        {
            matches: [
                {
                    player1: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Player",
                    },
                    player2: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Player",
                    },
                    winner: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Player",
                    },
                },
            ],
        },
    ],
});

export const Tournament = mongoose.model("Tournament", tournamentSchema);
