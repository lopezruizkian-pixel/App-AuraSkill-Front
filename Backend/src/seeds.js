const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Conectar a MongoDB
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URI_LOCAL ||
  'mongodb://localhost:27017/AuraSkill';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error conectando:', err.message);
    process.exit(1);
  });

// Definir esquema de usuario
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
});

const User = mongoose.model('User', userSchema);

// Crear usuario de prueba
async function createTestUser() {
  try {
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ correo: 'test@example.com' });
    
    if (userExists) {
      console.log('⚠️  El usuario ya existe en la base de datos');
      console.log('📊 Usuario:', userExists);
      mongoose.disconnect();
      process.exit(0);
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    // Crear usuario
    const newUser = new User({
      nombre: 'Usuario Test',
      usuario: 'test_user',
      correo: 'test@example.com',
      password: hashedPassword,
      rol: 'mentor',
      habilidades: ['JavaScript', 'React', 'MongoDB'],
      intereses: ['Programación', 'Web Development'],
      mood_actual: 'Happy'
    });

    // Guardar en BD
    const savedUser = await newUser.save();

    console.log('✅ ¡Usuario creado exitosamente!');
    console.log('📊 Detalles del usuario:');
    console.log('  • ID:', savedUser._id);
    console.log('  • Nombre:', savedUser.nombre);
    console.log('  • Email:', savedUser.correo);
    console.log('  • Usuario:', savedUser.usuario);
    console.log('  • Rol:', savedUser.rol);
    console.log('  • Habilidades:', savedUser.habilidades.join(', '));
    console.log('  • Creado:', savedUser.created_at);

    mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
    mongoose.disconnect();
    process.exit(1);
  }
}

// Ejecutar
createTestUser();
