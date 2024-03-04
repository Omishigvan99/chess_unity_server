import { Router } from "express";
import {
    createTournament,
    getTournamentById,
    updateTournament,
    deleteTournament,
    getAllTournaments,
    registerPlayer,
} from "../controllers/tournament.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJwt);

router
    .route("/:tournamentId")
    .get(getTournamentById)
    .delete(deleteTournament)
    .patch(updateTournament);
router.route("/create").post(createTournament);
router.route("/").get(getAllTournaments);
router.route("/register-player/:tournamentId").post(registerPlayer);

export default router;
