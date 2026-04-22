import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { RoomProvider } from './context/RoomContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import BuscarHabilidades from './pages/BuscarHabilidades'; 
import Mentores from './pages/Mentores';
import HistorialSalasAprendiz from './pages/HistorialSalasAprendiz';
import SalasActivas from './pages/SalasActivas';
import RoomPage from './pages/RoomPage';
import Configuracion from './pages/Configuracion';
import Perfil from './pages/Perfil';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ToastContainer />
        <Router>
          <RoomProvider>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />

              {/* Rutas protegidas - Requieren autenticación */}
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/buscar-habilidades" 
                element={
                  <ProtectedRoute>
                    <BuscarHabilidades />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/mentores" 
                element={
                  <ProtectedRoute>
                    <Mentores />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/historial" 
                element={
                  <ProtectedRoute>
                    <HistorialSalasAprendiz />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/salas-activas" 
                element={
                  <ProtectedRoute>
                    <SalasActivas />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/sala/:id" 
                element={
                  <ProtectedRoute>
                    <RoomPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/configuracion" 
                element={
                  <ProtectedRoute>
                    <Configuracion />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                } 
              />

              {/* Ruta por defecto para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RoomProvider>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;