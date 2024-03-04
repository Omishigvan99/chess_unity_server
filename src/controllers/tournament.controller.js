import { asyncHandler } from "../utils/AsyncHandler.js";
import { Tournament } from "../models/tournament.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTournament = asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!(name && type)) {
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "fields must be provided"
        );
        getError.sendResponse(res);
        throw getError;
    }

    const hostedBy = req.user._id;
    if (!hostedBy) {
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "Unauthorized access"
        );
        getError.sendResponse(res);
        throw getError;
    }

    const tournament = await Tournament.create({
        name,
        hostedBy,
        type,
        status: "registrations On",
    });

    if (!tournament) {
        const getError = new ApiError(
            500,
            "Tournament Registration Error",
            "Tournament not created"
        );
        getError.sendResponse(res);
        throw getError;
    }

    res.status(201).json(
        new ApiResponse(201, "Tournament created", tournament)
    );
});

const getTournamentById = asyncHandler(async (req, res) => {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
        const getError = new ApiError(
            500,
            "Tournament Fetch Error",
            "Tournament not found"
        );
        getError.sendResponse(res);
        throw getError;
    }
    res.status(200).json(new ApiResponse(200, "Tournament found", tournament));
});

const deleteTournament = asyncHandler(async (req, res) => {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findByIdAndDelete(tournamentId);
    if (!tournament) {
        const getError = new ApiError(
            404,
            "Tournament not found",
            "Tournament not found"
        );
        getError.sendResponse(res);
        throw getError;
    }
    res.status(200).json(
        new ApiResponse(200, "Tournament deleted", tournament)
    );
});

const getAllTournaments = asyncHandler(async (req, res) => {
    const tournaments = await Tournament.find({});
    if (!tournaments) {
        const getError = new ApiError(
            500,
            "Tournaments Fetch Error",
            "Tournaments not found"
        );
        getError.sendResponse(res);
        throw getError;
    }
    res.status(200).json(
        new ApiResponse(200, "Tournaments found", tournaments)
    );
});

const updateTournament = asyncHandler(async (req, res) => {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findByIdAndUpdate(
        tournamentId,
        {
            name: req.body?.name?.trim(),
            type: req.body?.type,
            status: req.body?.status,
            winner: req.body?.winner,
        },
        { validateBeforeSave: true, new: true }
    );
    if (!tournament) {
        const getError = new ApiError(
            500,
            "Tournament Update Error",
            "Tournament not found"
        );
        getError.sendResponse(res);
        throw getError;
    }
    res.status(200).json(
        new ApiResponse(200, "Tournament updated", tournament)
    );
});

const registerPlayer = asyncHandler(async (req, res) => {
    const { tournamentId } = req.params;
    const { playerId } = req.body;
    
    if (!(tournamentId && playerId)) {
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "fields must be provided"
        );
        getError.sendResponse(res);
        throw getError;
    }

    if(!mongoose.Types.ObjectId.isValid(playerId)){
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "Invalid player Id"
        );
        getError.sendResponse(res);
        throw getError;
    }

    if(!mongoose.Types.ObjectId.isValid(tournamentId)){
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "Invalid tournament Id"
        );
        getError.sendResponse(res);
        throw getError;
    }

    const tournament = await Tournament.findByIdAndUpdate(
        tournamentId,
        {
            $push: { players: playerId },
        },
        { validateBeforeSave: true, new: true }
    );
    if (!tournament) {
        const getError = new ApiError(
            500,
            "Tournament Update Error",
            "Tournament not found"
        );
        getError.sendResponse(res);
        throw getError;
    }
    res.status(200).json(new ApiResponse(200, "Player registered", tournament));
});

export {
    createTournament,
    getTournamentById,
    deleteTournament,
    getAllTournaments,
    updateTournament,
    registerPlayer,
};
