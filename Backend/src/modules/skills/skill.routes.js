const express = require("express")
const { getSkills, getSkillById, assignSkill, unassignSkill, getCategories } = require("./skill.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")

const router = express.Router()

const { SECRET } = require("../../utils/jwt")

const optionalToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        req.user = require("jsonwebtoken").verify(token, SECRET);
      } catch (e) {
        // Ignorar error si el token es inválido en modo opcional
      }
    }
  }
  next();
};

router.get("/", optionalToken, getSkills)
router.get("/categories", getCategories)
router.get("/:id", getSkillById)
router.post("/assign", verifyToken, assignSkill)
router.delete("/:skillId", verifyToken, unassignSkill)

module.exports = router
