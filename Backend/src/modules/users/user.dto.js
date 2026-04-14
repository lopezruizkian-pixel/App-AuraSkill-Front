function validateUpdateUser(data){

  if(data.nombre && typeof data.nombre !== "string"){
    throw new Error("Nombre inválido")
  }

  if(data.usuario && typeof data.usuario !== "string"){
    throw new Error("Usuario inválido")
  }

}

module.exports = {
  validateUpdateUser
}
