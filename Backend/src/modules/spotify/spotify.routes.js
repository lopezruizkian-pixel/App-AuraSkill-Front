const express = require("express")
const { getPlaylists } = require("./spotify.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")

const router = express.Router()

router.get("/mood/:mood", verifyToken, getPlaylists)

module.exports = router
