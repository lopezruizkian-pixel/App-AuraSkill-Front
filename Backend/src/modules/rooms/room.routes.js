const express = require("express")
const { getRooms, getRoomById, getRoomHistory, createRoom, joinRoom, deleteRoom } = require("./room.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")
const { verifyRole } = require("../../middlewares/role.middleware")

const router = express.Router()

// Públicas
router.get("/", getRooms)
router.get("/:id", getRoomById)

// Autenticado (cualquier rol)
router.get("/history", verifyToken, getRoomHistory)
router.post("/:id/join", verifyToken, verifyRole("alumno"), joinRoom)

// Solo mentor
router.post("/", verifyToken, verifyRole("mentor"), createRoom)
router.delete("/:id", verifyToken, verifyRole("mentor"), deleteRoom)

module.exports = router
