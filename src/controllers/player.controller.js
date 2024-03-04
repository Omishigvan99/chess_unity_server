import { ApiError } from "../utils/ApiError.js";
import { Player } from "../models/player.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getPlayer = asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const player = await Player.findById(playerId);
    if (!player) {
        throw new ApiError(404, "Player not found");
    }
    res.status(200).json(new ApiResponse(200, player));
});

const updatePlayer = asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const player = await Player.findByIdAndUpdate(
        playerId,
        {
            $set: req.body,
        },
        { new: true }
    );

    if (!player) {
        throw new ApiError(404, "Player not found");
    }
    res.status(200).json(new ApiResponse(200, player));
});

const getAllPlayers = asyncHandler(async (req, res) => {
    const players = await Player.find();
    res.status(200).json(new ApiResponse(200, players));
});

export { getPlayer, updatePlayer, getAllPlayers };
