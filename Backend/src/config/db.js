const mongoose = require("mongoose")

const MONGO_URI = "mongodb+srv://Admin:GG_2202UP@auraskill.klhsbkl.mongodb.net/AuraSkill?retryWrites=true&w=majority"
const connectDB = async () => {
  try {

    await mongoose.connect(MONGO_URI)

    console.log("MongoDB conectado")

  } catch (error) {

    console.error("Error conectando MongoDB:", error.message)

    process.exit(1)

  }
}

module.exports = connectDB