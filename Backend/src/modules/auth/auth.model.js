const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ["mentor", "alumno"],
    default: "alumno"
  },
  habilidades: [{
    type: String
  }],
  intereses: [{
    type: String
  }],
  mood_actual: {
    type: String,
    default: "neutral"
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("User", userSchema)