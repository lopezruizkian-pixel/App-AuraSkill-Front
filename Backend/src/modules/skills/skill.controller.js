const { crearSkill, obtenerSkills, obtenerSkillPorId, buscarSkills, eliminarSkill } = require("./skill.service");

const ensureMentor = (req) => {
  if (req.user?.rol !== "mentor") {
    const error = new Error("Solo los mentores pueden administrar habilidades");
    error.status = 403;
    throw error;
  }
};

const getSkills = async (req, res) => {
  try {
    const { q } = req.query;
    const mentorId = req.user?.rol === "mentor" ? req.user.id : null;
    const skills = q
      ? await buscarSkills(q, mentorId)
      : await obtenerSkills(mentorId);
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await obtenerSkillPorId(req.params.id);
    if (!skill) return res.status(404).json({ error: "Habilidad no encontrada" });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSkill = async (req, res) => {
  try {
    ensureMentor(req);
    const skill = await crearSkill(req.body, req.user.id);
    res.status(201).json({ message: "Habilidad creada", skill });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    ensureMentor(req);
    await eliminarSkill(req.params.id);
    res.json({ message: "Habilidad eliminada" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { getSkills, getSkillById, createSkill, deleteSkill };
