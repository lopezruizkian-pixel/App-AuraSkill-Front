const express = require("express")
const cors = require("cors")

// Rutas
const authRoutes = require("./modules/auth/auth.routes")
const userRoutes = require("./modules/users/user.routes")

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API AuraSkill funcionando correctamente"
  })
})

// Rutas de la API
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  })
})

module.exports = app
