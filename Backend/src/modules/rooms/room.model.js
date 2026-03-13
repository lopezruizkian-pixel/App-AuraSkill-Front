const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  habilidad: { type: String, required: true },
  capacidad_maxima: { type: Number, default: 10 },
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  estado: { type: String, enum: ["activa", "cerrada", "pendiente"], default: "activa" },
  created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Room", roomSchema)
