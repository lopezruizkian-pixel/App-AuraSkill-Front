import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import BuscarHabilidades from './pages/BuscarHabilidades'; 
import Mentores from './pages/Mentores';
import HistorialSalasAprendiz from './pages/HistorialSalasAprendiz';
import CrearSala from './pages/CrearSala';
import SalasActivas from './pages/SalasActivas';
import Configuracion from './pages/Configuracion';
import Perfil from './pages/Perfil';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/buscar-habilidades" element={<BuscarHabilidades />} /> 
        <Route path="/mentores" element={<Mentores />} />
        <Route path="/historial" element={<HistorialSalasAprendiz />} />
        <Route path="/crear-sala" element={<CrearSala />} />
        <Route path="/salas-activas" element={<SalasActivas />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;