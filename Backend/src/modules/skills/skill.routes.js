const express = require("express")
const { getSkills, getSkillById, createSkill, deleteSkill } = require("./skill.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")

const router = express.Router()

router.get("/", getSkills)
router.get("/:id", getSkillById)
router.post("/", verifyToken, createSkill)
router.delete("/:id", verifyToken, deleteSkill)

module.exports = router
