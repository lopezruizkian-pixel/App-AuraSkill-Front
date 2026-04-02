const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const { crearSkillsBase } = require('./modules/skills/skill.service');

const baseSkills = [
  {
    nombre: 'Programacion',
    descripcion: 'Desarrollo de logica, algoritmos y construccion de aplicaciones web o moviles.',
    categoria: 'Tecnologia',
    nivel: 'intermedio',
  },
  {
    nombre: 'Diseno UI/UX',
    descripcion: 'Creacion de interfaces y experiencias de usuario centradas en claridad y usabilidad.',
    categoria: 'Diseno',
    nivel: 'intermedio',
  },
  {
    nombre: 'Marketing Digital',
    descripcion: 'Estrategias para redes sociales, contenido, anuncios y crecimiento de marca.',
    categoria: 'Negocios',
    nivel: 'basico',
  },
  {
    nombre: 'Idiomas',
    descripcion: 'Practica conversacional y refuerzo de vocabulario, gramatica y comprension.',
    categoria: 'Educacion',
    nivel: 'basico',
  },
  {
    nombre: 'Musica',
    descripcion: 'Teoria musical, instrumento, ritmo y practica guiada en sesiones creativas.',
    categoria: 'Arte',
    nivel: 'basico',
  },
  {
    nombre: 'Gaming',
    descripcion: 'Coaching en videojuegos, estrategia, comunicacion y trabajo en equipo.',
    categoria: 'Entretenimiento',
    nivel: 'basico',
  },
  {
    nombre: 'MongoDB',
    descripcion: 'Modelado de datos, consultas, agregaciones y diseno de bases NoSQL.',
    categoria: 'Tecnologia',
    nivel: 'avanzado',
  },
  {
    nombre: 'React',
    descripcion: 'Construccion de interfaces modernas con componentes, estado y consumo de APIs.',
    categoria: 'Tecnologia',
    nivel: 'avanzado',
  },
];

async function seedSkills() {
  try {
    await connectDB();
    const skills = await crearSkillsBase(baseSkills);
    console.log(`[Skills Seed] Habilidades disponibles: ${skills.length}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Skills Seed] Error poblando habilidades:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedSkills();
