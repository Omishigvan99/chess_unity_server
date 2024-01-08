import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userGameDataSchema = new mongoose.Schema({
    rank: {
        type: Number,
        default: 0,
    },
    totalGames: {
        type: Number,
        default: 0,
    },
    gameWin: {
        type: Number,
        default: 0,
    },
    gamelost: {
        type: Number,
        default: 0,
    },
});

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        avatar: {
            type: String, //cloudinary url
        },
        gameInfo: {
            type: [userGameDataSchema],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.generateAccessTokenSecret,
        {
            expiresIn: process.env.accessTokenExpiry,
        }
    );
};

export const User = mongoose.model("User", userSchema);