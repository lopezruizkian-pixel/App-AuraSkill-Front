const express = require("express")
const { getSkills, getSkillById, createSkill, deleteSkill } = require("./skill.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")
const { verifyRole } = require("../../middlewares/role.middleware")

const router = express.Router()

// Autenticado (cualquier rol)
router.get("/", verifyToken, getSkills)
router.get("/:id", verifyToken, getSkillById)

// Solo mentor
router.post("/", verifyToken, verifyRole("mentor"), createSkill)
router.delete("/:id", verifyToken, verifyRole("mentor"), deleteSkill)

module.exports = router
