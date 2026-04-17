const express = require("express")
const {
  getUsers,
  getUser,
  update,
  remove
} = require("./user.controller")

const { verifyToken } = require("../../middlewares/auth.middleware")

const router = express.Router()

router.get("/", verifyToken, getUsers)

router.get("/:id", verifyToken, getUser)

router.put("/:id", verifyToken, update)

router.delete("/:id", verifyToken, remove)

module.exports = router
