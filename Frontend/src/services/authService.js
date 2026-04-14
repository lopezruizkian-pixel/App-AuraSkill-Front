import API_URL from "./api"

export const loginUser = async (correo, password) => {

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      correo,
      password
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Error al iniciar sesión")
  }

  return data
}

export const registerUser = async (userData) => {

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Error en registro")
  }

  return data
}
