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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game"
        },
    ],
},
    { timestamps: true }
);

export const Tournament = mongoose.model("Tournament", tournamentSchema);
