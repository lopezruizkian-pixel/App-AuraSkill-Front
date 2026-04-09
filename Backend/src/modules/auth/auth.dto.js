function validateRegister(data) {

  if(!data.nombre) throw new Error("Nombre requerido")
  if(!data.usuario) throw new Error("Usuario requerido")
  if(!data.correo) throw new Error("Correo requerido")
  if(!data.password) throw new Error("Password requerido")

}

function validateLogin(data){

  if(!data.correo) throw new Error("Correo requerido")
  if(!data.password) throw new Error("Password requerido")

}

module.exports = {
  validateRegister,
  validateLogin
}