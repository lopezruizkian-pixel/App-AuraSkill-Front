const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const connectDB = require('./config/db');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  usuario: {
    type: String,
    required: true,
    unique: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ['mentor', 'alumno'],
    default: 'alumno',
  },
  habilidades: [
    {
      type: String,
    },
  ],
  intereses: [
    {
      type: String,
    },
  ],
  mood_actual: {
    type: String,
    default: 'neutral',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    await connectDB();

    const userExists = await User.findOne({ correo: 'test@example.com' });

    if (userExists) {
      console.log('El usuario ya existe en la base de datos');
      console.log('Usuario:', userExists);
      await mongoose.disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Test123!', 10);

    const newUser = new User({
      nombre: 'Usuario Test',
      usuario: 'test_user',
      correo: 'test@example.com',
      password: hashedPassword,
      rol: 'mentor',
      habilidades: ['JavaScript', 'React', 'MongoDB'],
      intereses: ['Programacion', 'Web Development'],
      mood_actual: 'Happy',
    });

    const savedUser = await newUser.save();

    console.log('Usuario creado exitosamente');
    console.log('ID:', savedUser._id);
    console.log('Nombre:', savedUser.nombre);
    console.log('Email:', savedUser.correo);
    console.log('Usuario:', savedUser.usuario);
    console.log('Rol:', savedUser.rol);
    console.log('Habilidades:', savedUser.habilidades.join(', '));
    console.log('Creado:', savedUser.created_at);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creando usuario:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createTestUser();
