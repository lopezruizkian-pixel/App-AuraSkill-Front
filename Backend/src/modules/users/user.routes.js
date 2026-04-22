const express = require("express")
const { getUsers, getUser, update, remove } = require("./user.controller")
const { verifyToken } = require("../../middlewares/auth.middleware")
const { verifyRole } = require("../../middlewares/role.middleware")

const router = express.Router()

// Cualquier usuario autenticado puede ver su propio perfil
router.get("/:id", verifyToken, getUser)

// Solo mentor puede ver lista de usuarios
router.get("/", verifyToken, verifyRole("mentor"), getUsers)

// Solo el propio usuario puede actualizarse (verificado en controller)
router.put("/:id", verifyToken, update)

// Solo mentor puede eliminar usuarios
router.delete("/:id", verifyToken, verifyRole("mentor"), remove)

module.exports = router
