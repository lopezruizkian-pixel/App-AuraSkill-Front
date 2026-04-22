const {
  crearSkill,
  obtenerSkills,
  obtenerSkillPorId,
  buscarSkills,
  eliminarSkill,
} = require("./skill.service");

const ensureMentor = (req) => {
  if (req.user?.rol !== "mentor") {
    const error = new Error("Solo los mentores pueden administrar habilidades");
    error.status = 403;
    throw error;
  }
};

const getSkills = async (req, res) => {
  try {
    const { q, own } = req.query;
    const mentor_id = own === 'true' && req.user ? req.user.id : null;
    const skills = q ? await buscarSkills(q, mentor_id) : await obtenerSkills(mentor_id);
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

const createSkill = async (req, res) => {
  try {
    ensureMentor(req);
    const skillData = { ...req.body, mentor_id: req.user.id };
    const skill = await crearSkill(skillData);
    res.status(201).json({ message: "Habilidad creada", skill });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    ensureMentor(req);
    const deletedSkill = await eliminarSkill(req.params.id);

    if (!deletedSkill) {
      return res.status(404).json({ error: "Habilidad no encontrada" });
    }

    res.json({ message: "Habilidad eliminada" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  deleteSkill,
};
