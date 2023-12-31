const express = require("express");
const {
  getCompetitionInfo,
  createCompetition,
  startCompetition,
  endCompetition,
  getCompetitionsList,
  getCompetitorUsers,
  cancelCompetition,
  removeFromCompetition,
  advanceCompetitionRound,
  getRounds,
  leaveCompetition,
  joinCompetition,
  getTopParticipants,
  getCompetitionInfoForEdit,
  editCompetition,
  searchCompetition,
} = require("../controllers/competition.controller");
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const { upload } = require("../services/storage");
const router = express.Router();

// get
router.get("/info/:name", authGuard, getCompetitionInfo);
router.get("/list/", authGuard, getCompetitionsList);
router.get("/admin/list", adminAuthGuard, getCompetitionsList);
router.get("/user/list/:id", adminAuthGuard, getCompetitorUsers);
router.get("/rounds/:id", authGuard, getRounds);
router.get("/admin/rounds/:id", adminAuthGuard, getRounds);
router.get("/winners/:competition/:round", authGuard, getTopParticipants);
router.get("/edit/:id", adminAuthGuard, getCompetitionInfoForEdit);
router.get("/search", authGuard, searchCompetition);

// post
router.post(
  "/create",
  adminAuthGuard,
  upload.fields([{ name: "file" }, { name: "stickers" }]),
  createCompetition
);

router.post("/start/:id", adminAuthGuard, startCompetition);
router.post("/end/:id", adminAuthGuard, endCompetition);
router.post("/cancel/:id", adminAuthGuard, cancelCompetition);
router.post("/advance/:id", adminAuthGuard, advanceCompetitionRound);
router.post("/:competition/join", authGuard, joinCompetition);
router.post("/:competition/leave", authGuard, leaveCompetition);
router.post(
  "/:competition/remove/:user",
  adminAuthGuard,
  removeFromCompetition
);

// put
router.put(
  "/edit/:id",
  adminAuthGuard,
  upload.fields([{ name: "file" }, { name: "stickers" }]),
  editCompetition
);

module.exports = router;
