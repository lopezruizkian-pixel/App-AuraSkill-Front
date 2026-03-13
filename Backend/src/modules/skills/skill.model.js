const mongoose = require("mongoose")

const skillSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  nivel: { type: String, enum: ["basico", "intermedio", "avanzado"], default: "basico" },
  created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Skill", skillSchema)
