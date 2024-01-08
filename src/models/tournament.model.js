import mongoose from "mongoose";

const tournmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        hostedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participents: {
            type: [mongoose.Types.ObjectId],
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);
