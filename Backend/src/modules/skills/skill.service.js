const Skill = require("./skill.model")

const crearSkill = async (data) => {
  const skill = new Skill(data)
  await skill.save()
  return skill
}

const obtenerSkills = async () => {
  return await Skill.find()
}

const obtenerSkillPorId = async (id) => {
  return await Skill.findById(id)
}

const buscarSkills = async (query) => {
  return await Skill.find({
    $or: [
      { nombre: { $regex: query, $options: "i" } },
      { categoria: { $regex: query, $options: "i" } }
    ]
  })
}

const eliminarSkill = async (id) => {
  return await Skill.findByIdAndDelete(id)
}

module.exports = { crearSkill, obtenerSkills, obtenerSkillPorId, buscarSkills, eliminarSkill }
