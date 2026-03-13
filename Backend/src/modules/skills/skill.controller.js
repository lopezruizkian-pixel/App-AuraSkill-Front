const { crearSkill, obtenerSkills, obtenerSkillPorId, buscarSkills, eliminarSkill } = require("./skill.service")

const getSkills = async (req, res) => {
  try {
    const { q } = req.query
    const skills = q ? await buscarSkills(q) : await obtenerSkills()
    res.json(skills)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSkillById = async (req, res) => {
  try {
    const skill = await obtenerSkillPorId(req.params.id)
    if (!skill) return res.status(404).json({ error: "Habilidad no encontrada" })
    res.json(skill)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createSkill = async (req, res) => {
  try {
    const skill = await crearSkill(req.body)
    res.json({ message: "Habilidad creada", skill })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteSkill = async (req, res) => {
  try {
    await eliminarSkill(req.params.id)
    res.json({ message: "Habilidad eliminada" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getSkills, getSkillById, createSkill, deleteSkill }
