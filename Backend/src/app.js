const express = require("express")
const cors = require("cors")
const authRoutes = require("./modules/auth/auth.routes")
const roomRoutes = require("./modules/rooms/room.routes")
const skillRoutes = require("./modules/skills/skill.routes")
const spotifyRoutes = require("./modules/spotify/spotify.routes")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/spotify", spotifyRoutes)

module.exports = app