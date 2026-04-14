# Frontend - AuraSkill

## 🚀 Instalación y Setup

### Prerequisitos
- Node.js 16+ 
- npm o yarn

### Configuración de Variables de Entorno

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Actualizar valores según tu entorno:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
VITE_SOCKET_URL=http://localhost:3000
```

Para producción (`env.production`):
```env
VITE_API_URL=https://api.auraskill.com/api
VITE_APP_ENV=production
VITE_SOCKET_URL=https://api.auraskill.com
```

### Instalación de Dependencias

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview (Producción Local)

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Context API (RoomContext, ThemeContext, ToastContext)
├── hooks/              # Custom hooks (useAuth, useToast, useWebSocket, etc)
├── pages/              # Pages/Vistas
├── services/           # Servicios API y utilidades
├── Styles/             # CSS específico por página
├── App.jsx             # Componente raíz
├── main.jsx            # Punto de entrada
└── index.css           # Estilos globales
```

---

## 🔒 Seguridad

### Token Autenticación
- Los tokens se almacenan en `localStorage`
- El interceptor HTTP (`httpClient.js`) maneja automáticamente:
  - Tokens expirados (401) → Redirige a login
  - Errores de autorización (403)
  - Errores del servidor (500+)

### Validación
- Validación de inputs usando `services/validation.js`
- Sanitización de strings para prevenir XSS
- Validación de formularios antes de enviar

### Rutas Protegidas
- Rutas que requieren autenticación usan `<ProtectedRoute>`
- Soporte para autorización por rol

---

## 🎯 Arquitectura

### Gestión de Estado
- **RoomContext**: Datos de salas y participantes
- **ThemeContext**: Sistema de temas
- **ToastContext**: Notificaciones globales

### Hooks Principales
- `useAuth()`: Gestión de autenticación
- `useToast()`: Sistema de notificaciones
- `useWebSocket()`: Conexión en tiempo real
- `useRoom()`: Carga de datos de salas

### Servicios
- `httpClient.js`: Interceptor HTTP centralizado
- `authService.js`: Login y registro
- `roomService.js`: Operaciones de salas
- `validation.js`: Validadores de formularios

---

## 🔄 WebSocket

### Eventos Soportados

**Emisión:**
- `sendMessage`: Enviar mensaje
- `sendReaction`: Enviar reacción (emoji)
- `userTyping`: Notificar que está escribiendo
- `userStoppedTyping`: Notificar que paró de escribir

**Recepción:**
- `userJoined`: Usuario se unió a la sala
- `userLeft`: Usuario salió
- `newMessage`: Nuevo mensaje
- `newReaction`: Nueva reacción
- `userTyping`: Indicador de escritura

---

## 🎨 Temas

Dos temas disponibles:
- **neon**: Tema vibrante con gradientes
- **classic**: Tema clásico

Cambiar tema:
```javascript
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

function MyComponent() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={() => setTheme(theme === 'neon' ? 'classic' : 'neon')}>
      Toggle Theme
    </button>
  );
}
```

---

## 📢 Notificaciones (Toast)

```javascript
import { useToast } from '../hooks/useToast';

function MyComponent() {
  const { success, error, info, warning } = useToast();
  
  const handleAction = async () => {
    try {
      // hacer algo
      success('¡Éxito!');
    } catch (err) {
      error(err.message);
    }
  };
}
```

---

## ✅ Validación de Formularios

```javascript
import { validators, validateForm } from '../services/validation';

const formData = {
  nombre: 'Juan',
  correo: 'juan@example.com',
  password: 'Pass123!',
  limiteEstudiantes: 10,
};

const { valid, errors } = validateForm(formData, validators.crearSalaForm);

if (!valid) {
  console.log('Errores:', errors);
}
```

---

## 🐛 Debugging

### Desarrollo
- Abre DevTools (F12)
- Pestaña Console para logs
- Pestaña Network para ver peticiones HTTP
- Pestaña Storage/Application para localStorage

### Logs
- WebSocket: `[WebSocket]` prefix
- HTTP: `[HTTP]` prefix
- Componentes: Usa `console.log()` con contexto

---

## 📝 Checklist de Implementación

- [x] Variables de entorno
- [x] Interceptor HTTP centralizado
- [x] Validación de inputs
- [x] Autenticación y rutas protegidas
- [x] Sistema de notificaciones Toast
- [x] WebSocket mejorado con cleanup
- [x] FormCrearSala funcional
- [ ] ChatRoom (próximo)
- [ ] Reacciones flotantes (próximo)
- [ ] Video/Audio (próximo)
- [ ] Tests (próximo)

---

## 🚀 Próximos Pasos

1. **Implementar ChatRoom completo**
2. **Agregar funcionalidad de video/audio**
3. **Mejorar UX con animaciones**
4. **Tests unitarios e integración**
5. **Performance optimization**

---

## 📞 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.
