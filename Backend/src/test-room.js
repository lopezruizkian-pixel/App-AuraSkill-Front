const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URI_LOCAL ||
  'mongodb://localhost:27017/AuraSkill';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  nombre: String,
  usuario: String,
  correo: String,
  password: String,
  rol: String,
});

const roomSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  habilidad: { type: String, required: true },
  capacidad_maxima: { type: Number, default: 10 },
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  estado: { type: String, enum: ["activa", "cerrada", "pendiente"], default: "activa" },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Room = mongoose.model('Room', roomSchema);

async function testRoomCreation() {
  try {
    // Buscar mentor
    const mentor = await User.findOne({ rol: 'mentor' });
    
    if (!mentor) {
      console.log('⚠️  No hay ningún mentor en la BD. Primero ejecuta: node seeds.js');
      mongoose.disconnect();
      process.exit(0);
    }

    console.log('📊 Mentor encontrado:', mentor.nombre);

    // Crear sala de prueba
    const newRoom = new Room({
      nombre: 'Sala Test JavaScript',
      descripcion: 'Sala para aprender JavaScript',
      mentor: mentor._id,
      habilidad: 'JavaScript',
      capacidad_maxima: 20,
      estado: 'activa'
    });

    const savedRoom = await newRoom.save();

    console.log('\n✅ ¡Sala creada exitosamente!');
    console.log('📊 Detalles de la sala:');
    console.log('  • ID:', savedRoom._id);
    console.log('  • Nombre:', savedRoom.nombre);
    console.log('  • Habilidad:', savedRoom.habilidad);
    console.log('  • Mentor:', mentor.nombre);
    console.log('  • Estado:', savedRoom.estado);
    console.log('  • Capacidad Máxima:', savedRoom.capacidad_maxima);

    // Verificar que se guardó
    const roomInDB = await Room.findById(savedRoom._id).populate('mentor');
    console.log('\n✅ Sala verificada en BD:');
    console.log('  • Nombre:', roomInDB.nombre);
    console.log('  • Mentor:', roomInDB.mentor.nombre);

    mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.disconnect();
    process.exit(1);
  }
}

testRoomCreation();
