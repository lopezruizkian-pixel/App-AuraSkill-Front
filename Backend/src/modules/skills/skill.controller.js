const {
  obtenerCatalogoSkills,
  obtenerSkillPorId,
  asignarSkillAMentor,
  desasignarSkillDeMentor,
  obtenerSkillsPorMentor,
  buscarSkillsEnCatalogo
} = require("./skill.service");

const ensureMentor = (req) => {
  if (req.user?.rol !== "mentor") {
    const error = new Error("Solo los mentores pueden administrar sus habilidades");
    error.status = 403;
    throw error;
  }
};

// Obtener habilidades: puede ser el catálogo completo o las de un mentor específico
const getSkills = async (req, res) => {
  try {
    const { q, mentorId, categoria } = req.query;
    
    let skills;
    if (mentorId) {
      // Si pasan un mentorId, devolvemos solo las de ese mentor
      skills = await obtenerSkillsPorMentor(mentorId);
    } else if (q) {
      // Búsqueda en el catálogo global
      skills = await buscarSkillsEnCatalogo(q);
    } else {
      // Catálogo global completo (con o sin filtro de categoría)
      skills = await obtenerCatalogoSkills(categoria);
    }
    
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await obtenerSkillPorId(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Habilidad no encontrada" });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// El mentor elige una habilidad del catálogo
const assignSkill = async (req, res) => {
  try {
    ensureMentor(req);
    const { skillId } = req.body;
    const userId = req.user.id;

    if (!skillId) {
      return res.status(400).json({ error: "Debe proporcionar el ID de la habilidad" });
    }

    const assigned = await asignarSkillAMentor(userId, skillId);
    res.status(201).json({ message: "Habilidad asignada con éxito", assigned });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// El mentor se quita una habilidad de su perfil
const unassignSkill = async (req, res) => {
  try {
    ensureMentor(req);
    const { skillId } = req.params;
    const userId = req.user.id;

    await desasignarSkillDeMentor(userId, skillId);
    res.json({ message: "Habilidad desasignada de tu perfil" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Obtener categorías únicas del catálogo
const getCategories = async (req, res) => {
  try {
    const { obtenerCategorias } = require("./skill.service");
    const categories = await obtenerCategorias();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSkills,
  getSkillById,
  assignSkill,
  unassignSkill,
  getCategories
};
