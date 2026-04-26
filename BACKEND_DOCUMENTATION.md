# 🚀 AuraSkill - Documentación Técnica del Backend

Esta documentación describe la arquitectura, seguridad, flujos y endpoints de la API de AuraSkill, diseñada para conectar mentores y aprendices en una red de aprendizaje emocional.

---

## 🏗️ 1. Arquitectura y Tecnologías
La API está construida sobre **Node.js** utilizando el framework **Express**, siguiendo una estructura modular para facilitar la escalabilidad.

-   **Entorno**: Node.js (v18+)
-   **Framework**: Express 5.x
-   **Base de Datos**: PostgreSQL (con `pg` pool)
-   **Tiempo Real**: Socket.io (para comunicación en salas)
-   **Seguridad**: JWT (JSON Web Tokens) + HttpOnly Cookies

### Librerías Principales:
-   `jsonwebtoken`: Generación y validación de tokens.
-   `bcrypt`: Hasheo de contraseñas.
-   `cookie-parser`: Manejo de cookies seguras.
-   `helmet`: Protección de cabeceras HTTP.
-   `cors`: Control de acceso por dominios.
-   `dotenv`: Gestión de variables de entorno.

---

## 🔐 2. Seguridad y Autenticación

### Flujo de Autenticación (HttpOnly Cookies)
Hemos implementado un flujo de seguridad de nivel profesional para proteger contra ataques XSS:
1.  **Login**: El servidor valida credenciales y genera un JWT.
2.  **Entrega**: El JWT no se envía en el cuerpo del JSON, sino en una **Cookie HttpOnly**.
3.  **Protección**: JavaScript no puede leer la cookie (`HttpOnly`). Solo se envía vía HTTPS (`Secure`) y solo al dominio de la API (`SameSite: None`).
4.  **Persistencia**: El navegador envía la cookie automáticamente en cada petición subsiguiente.

### Validaciones y Permisos:
-   **Passwords**: Hasheados con `bcrypt` (10 salts).
-   **JWT Duration**: 24 horas.
-   **CORS**: Solo se permiten peticiones desde `localhost` y el dominio oficial en Vercel.
-   **SQL Injection**: Se utilizan consultas parametrizadas (`pool.query($1, [val])`) en todos los módulos.

---

## 📡 3. Catálogo de Endpoints (API v1)

### 🔑 Autenticación (`/api/auth`)
| Método | Endpoint | Descripción | Protección |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Registra un nuevo usuario (Mentor/Aprendiz) | Pública |
| POST | `/login` | Inicia sesión y genera Cookie HttpOnly | Pública |
| POST | `/logout` | Limpia la cookie de sesión | Pública |
| GET | `/profile` | Obtiene los datos del usuario actual | JWT (Cookie) |
| PUT | `/update-profile`| Actualiza datos del perfil | JWT (Cookie) |
| PUT | `/change-password`| Cambia la contraseña (requiere actual) | JWT (Cookie) |
| DELETE | `/delete-account`| Elimina la cuenta permanentemente | JWT (Cookie) |

### 🏫 Salas de Aprendizaje (`/api/rooms`)
| Método | Endpoint | Descripción | Protección |
| :--- | :--- | :--- | :--- |
| GET | `/` | Lista todas las salas activas | Pública |
| GET | `/history` | Historial de salas del usuario | JWT (Cookie) |
| GET | `/:id` | Detalle de una sala específica | Pública |
| POST | `/` | Crea una nueva sala | Solo Mentores |
| POST | `/:id/join` | Unirse a una sala activa | JWT (Cookie) |
| DELETE | `/:id` | Cerrar/Eliminar una sala | Creador (Mentor) |

### 🛠️ Habilidades (`/api/skills`)
| Método | Endpoint | Descripción | Protección |
| :--- | :--- | :--- | :--- |
| GET | `/` | Lista el catálogo global de habilidades | Opcional |
| GET | `/categories` | Lista categorías de habilidades | Pública |
| POST | `/assign` | Mentor se asigna una habilidad | Solo Mentores |
| DELETE | `/:skillId` | Mentor elimina una habilidad de su perfil | Solo Mentores |

---

## 🔄 4. Flujos Principales

### Flujo de Creación de Sala:
1.  El **Mentor** envía `POST /api/rooms` con nombre, habilidad y capacidad.
2.  El Backend verifica el **Rol** en el JWT.
3.  Se inserta en la DB y se inicializa el namespace de **Socket.io** para esa sala.
4.  Se devuelve el ID de la sala para la redirección.

### Flujo de Búsqueda y Filtros:
1.  El **Aprendiz** accede a `GET /api/skills`.
2.  El Backend devuelve el catálogo con conteo de mentores disponibles por habilidad.
3.  El aprendiz filtra por nombre o categoría en el Frontend.

---

## ⚠️ 5. Manejo de Errores
La API utiliza un middleware centralizado que estandariza las respuestas:
-   **Formato de respuesta**: `{ "error": "Mensaje descriptivo", "status": 400 }`
-   **Seguridad en Producción**: En el entorno de producción, los errores técnicos (Stack traces o errores de DB) se ocultan al cliente y se sustituyen por un mensaje genérico.

---

## ⚙️ 6. Configuración (Variables de Entorno)
Archivo `.env` necesario:
-   `DATABASE_URL`: URL de conexión a PostgreSQL.
-   `JWT_SECRET`: Clave maestra para firmar tokens.
-   `FRONTEND_URL`: URL permitida para CORS.
-   `NODE_ENV`: `development` o `production`.

---
*Documentación generada automáticamente por Antigravity para AuraSkill Project.*
