const Skill = require("./skill.model");

const normalizeSkillPayload = (data = {}) => ({
  nombre: data.nombre?.trim(),
  descripcion: data.descripcion?.trim(),
  categoria: data.categoria?.trim(),
  nivel: data.nivel || "basico",
});

const crearSkill = async (data) => {
  const skill = new Skill(normalizeSkillPayload(data));
  await skill.save();
  return skill;
};

const crearSkillsBase = async (skills = []) => {
  const normalizedSkills = skills.map(normalizeSkillPayload);

  const operations = normalizedSkills.map((skill) => ({
    updateOne: {
      filter: { nombre: skill.nombre },
      update: { $set: skill },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await Skill.bulkWrite(operations, { ordered: false });
  }

  return obtenerSkills();
};

const obtenerSkills = async () => {
  return await Skill.find().sort({ nombre: 1 });
};

const obtenerSkillPorId = async (id) => {
  return await Skill.findById(id);
};

const buscarSkills = async (query) => {
  const safeQuery = query?.trim();

  if (!safeQuery) {
    return obtenerSkills();
  }

  return await Skill.find({
    $or: [
      { nombre: { $regex: safeQuery, $options: "i" } },
      { categoria: { $regex: safeQuery, $options: "i" } },
      { descripcion: { $regex: safeQuery, $options: "i" } },
    ],
  }).sort({ nombre: 1 });
};

const eliminarSkill = async (id) => {
  return await Skill.findByIdAndDelete(id);
};

module.exports = {
  crearSkill,
  crearSkillsBase,
  obtenerSkills,
  obtenerSkillPorId,
  buscarSkills,
  eliminarSkill,
};
