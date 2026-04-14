function validateRegister(data) {

  if (!data.nombre) throw new Error("Nombre requerido")
  if (!data.usuario) throw new Error("Usuario requerido")
  if (!data.correo) throw new Error("Correo requerido")
  if (!data.password) throw new Error("Password requerido")

  if (data.password.length < 4) {
    throw new Error("La contraseña debe tener mínimo 4 caracteres")
  }

}

function validateLogin(data){

  if(!data.correo) throw new Error("Correo requerido")
  if(!data.password) throw new Error("Password requerido")

}

module.exports = {
  validateRegister,
  validateLogin
}
