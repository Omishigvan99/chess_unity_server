import { asyncHandler } from "../utils/AsyncHandler.js";
import { Tournament } from "../models/tournament.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Controller to create a new tournament

const createTournament = asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!(name && type)) {
        const getError = new ApiError(
            401,
            "Fields Error",
            "required fields must be provided"
        );
        getError.sendResponse(res);
        throw getError;
    }

    const hostedBy = req.user?._id;
    if (!hostedBy) {
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "Unauthorized access! User need to login."
        );
        getError.sendResponse(res);
        throw getError;
    }

    // check if tournament already exists
    const checkTournament = await Tournament.findOne({
        $and: [{ name }, { type }],
    });
    if (checkTournament) {
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "Tournament already exists"
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
            "Tournament Creation Error",
            "Tournament is unable to create!!! \n try again later"
        );
        getError.sendResponse(res);
        throw getError;
    }

    res.status(201).json(
        new ApiResponse(201, "Tournament created successfully", tournament)
    );
});

// Controller to get a tournament by its ID
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

// Controller to delete a tournament by its ID
const deleteTournament = asyncHandler(async (req, res) => {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findByIdAndDelete(tournamentId);
    if (!tournament) {
        const getError = new ApiError(
            404,
            "Tournament Fetch Error",
            "Tournament not found"
        );
        getError.sendResponse(res);
        throw getError;
    }
    res.status(200).json(
        new ApiResponse(200, "Tournament deleted successfully", tournament)
    );
});

// Controller to get all tournaments
const getAllTournaments = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        const getError = new ApiError(
            401,
            "Authentication Error",
            "Unauthorized request! login or signup first "
        );
        getError.sendResponse(res);
        throw getError;
    }

    // get all tournaments on the basis of user created tournaments,
    // user registered tournaments,
    // user played tournaments and all tournaments
    const tournaments = await Tournament.aggregate([
        {
            $facet: {
                userCreatedTournaments: [
                    {
                        $match: {
                            hostedBy: userId,
                        },
                    },
                ],
                userRegisteredTournaments: [
                    {
                        $match: {
                            players: userId,
                        },
                    },
                ],
                userPlayedTournaments: [
                    {
                        $match: {
                            winner: userId,
                        },
                    },
                ],
                allTournaments: [
                    {
                        $project: {
                            name: 1,
                            type: 1,
                            status: 1,
                            winner: 1,
                            players: 1,
                        },
                    },
                ],
            },
        },
    ]);
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

// Controller to update a tournament
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

// Controller to register a player to a tournament
const registerPlayer = asyncHandler(async (req, res) => {
    const { tournamentId } = req.params;

    if (! await mongoose.isValidObjectId(req.user._id)) {
        const getError = new ApiError(
            401,
            "Invalid Tournament Id",
            "Tournament Not Found"
        );
        getError.sendResponse(res);
        throw getError;
    }
    const getPlayer = req.user?._id;

    if (!(tournamentId && getPlayer)) {
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "fields must be provided"
        );
        getError.sendResponse(res);
        throw getError;
    }

    // check if player is already registered
    const checkPlayer = await Tournament.findOne({
        _id: tournamentId,
        players: getPlayer,
    });

    if (checkPlayer) {
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "Player already registered"
        );
        getError.sendResponse(res);
        throw getError;
    }

    const tournament = await Tournament.findByIdAndUpdate(
        tournamentId,
        {
            $push: { players: getPlayer },
        },
        { validateBeforeSave: false, new: true }
    );

    if (!tournament) {
        const getError = new ApiError(
            500,
            "Tournament Update Error",
            "unable to register player to tournament"
        );
        getError.sendResponse(res);
        throw getError;
    }
    res.status(200).json(new ApiResponse(200, "Player registered", tournament));
});

// Controller to unregister a player from a tournament
const unRegisterPlayer = asyncHandler(async (req, res) => {
    const { tournamentId } = req.params;

    if (!mongoose.isValidObjectId(req.user?._id)) {
        const getError = new ApiError(
            401,
            "Authentication Error",
            "Unauthorized request! login or signup first "
        );
        getError.sendResponse(res);
        throw getError;
    }
    const getPlayer = req.user?._id;

    if (!(tournamentId)) {
        const getError = new ApiError(
            401,
            "Fields Error",
            "fields must be provided"
        );
        getError.sendResponse(res);
        throw getError;
    }

    // check if player is already registered
    const checkPlayer = await Tournament.findOne({
        _id: tournamentId,
        players: getPlayer,
    });

    if (!checkPlayer) {
        const getError = new ApiError(
            401,
            "Tournament Registration Error",
            "Player not registered"
        );
        getError.sendResponse(res);
        throw getError;
    }

    const tournament = await Tournament.findByIdAndUpdate(
        tournamentId,
        {
            $pull: { players: getPlayer },
        },
        { validateBeforeSave: false, new: true }
    );

    if (!tournament) {
        const getError = new ApiError(
            500,
            "Tournament Update Error",
            "unable to unregister player from tournament"
        );
        getError.sendResponse(res);
        throw getError;
    }
    res.status(200).json(
        new ApiResponse(200, "Player unregistered", tournament)
    );
});

// Controller to get all players in a tournament
const getTournamentPlayers = asyncHandler(async (req, res) => {
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
    res.status(200).json(
        new ApiResponse(200, "Tournament players found", tournament.players)
    );
});

export {
    createTournament,
    getTournamentById,
    deleteTournament,
    getAllTournaments,
    updateTournament,
    registerPlayer,
    unRegisterPlayer,
    getTournamentPlayers,
};
