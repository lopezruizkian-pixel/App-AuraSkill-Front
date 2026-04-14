const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("./user.service")

const getUsers = async (req, res) => {

  try {

    const users = await getAllUsers()

    res.json(users)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}

const getUser = async (req, res) => {

  try {

    const user = await getUserById(req.params.id)

    res.json(user)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}

const update = async (req, res) => {

  try {

    const user = await updateUser(req.params.id, req.body)

    res.json(user)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}

const remove = async (req, res) => {

  try {

    await deleteUser(req.params.id)

    res.json({
      message: "Usuario eliminado"
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}

module.exports = {
  getUsers,
  getUser,
  update,
  remove
}
