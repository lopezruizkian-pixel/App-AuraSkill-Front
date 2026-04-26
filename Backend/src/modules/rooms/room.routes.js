const express = require("express")
const { getRooms, getRoomById, getRoomHistory, createRoom, joinRoom, deleteRoom, finishRoom } = require("./room.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")

const router = express.Router()

router.get("/", getRooms)
router.get("/history", verifyToken, getRoomHistory)
router.get("/:id", getRoomById)
router.post("/", verifyToken, createRoom)
router.post("/:id/join", verifyToken, joinRoom)
router.post("/:id/finish", verifyToken, finishRoom)
router.delete("/:id", verifyToken, deleteRoom)

module.exports = router
