const express = require("express")
const { register, login, getProfile, changePassword, deleteAccount, updateProfile } = require("./auth.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/profile", verifyToken, getProfile)
router.put("/change-password", verifyToken, changePassword)
router.put("/update-profile", verifyToken, updateProfile)
router.delete("/delete-account", verifyToken, deleteAccount)

module.exports = router
