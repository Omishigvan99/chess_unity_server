import { Router } from "express";
import {
    createTournament,
    getTournamentById,
    updateTournament,
    deleteTournament,
    getAllTournaments,
    registerPlayer,
    unRegisterPlayer,
    getTournamentPlayers,
} from "../controllers/tournament.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
//middleware to verify jwt token
router.use(verifyJwt);

router
    .route("/:tournamentId")
    .get(getTournamentById)
    .delete(deleteTournament)
    .patch(updateTournament);

router.route("/").get(getAllTournaments).post(createTournament);

router
    .route("/:tournamentId/player")
    .get(getTournamentPlayers)
    .post(registerPlayer)
    .delete(unRegisterPlayer);

export default router;
