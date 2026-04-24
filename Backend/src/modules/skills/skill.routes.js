const express = require("express")
const { getSkills, getSkillById, assignSkill, unassignSkill } = require("./skill.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")

const router = express.Router()

// Middleware opcional para verificar token sin bloquear si no existe (para ver catálogo)
const optionalToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      // Usamos el secreto directamente o desde config si existe
      const SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 
      req.user = require("jsonwebtoken").verify(token, SECRET);
    } catch (e) {
      // Ignorar error si el token es inválido en modo opcional
    }
  }
  next();
};

router.get("/", optionalToken, getSkills)
router.get("/:id", getSkillById)
router.post("/assign", verifyToken, assignSkill)
router.delete("/:skillId", verifyToken, unassignSkill)

module.exports = router
