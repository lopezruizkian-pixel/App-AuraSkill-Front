import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Es una buena práctica mover los estilos a un objeto o a un archivo .css
const styles = {
  container: { padding: '2rem', background: '#0a0e27', color: '#00ffff', minHeight: '100vh', fontFamily: 'monospace' },
  button: {
    marginTop: '1rem',
    marginRight: '1rem',
    padding: '0.8rem 1.5rem',
    background: '#00ffff',
    color: '#000',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  infoBox: { marginTop: '2rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' },
  instructions: { marginTop: '2rem', opacity: 0.7 }
};

function RoomDebug() {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState({ userId: '', userName: '', userRole: '' });

  const setupLocalStorage = (role) => {
    const userId = 'user-' + Date.now();
    const userName = `TestUser (${role})`;
    
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userRole', role);

    const newInfo = { userId, userName, userRole: role };
    setDebugInfo(newInfo);
    console.log('Debug Info Set:', newInfo);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setDebugInfo({ userId: '', userName: '', userRole: '' });
    console.log('Local storage cleared.');
  };

  // Cargar datos al iniciar
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    if (userId && userName && userRole) {
      setDebugInfo({ userId, userName, userRole });
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1>🧪 Debug Room</h1>

      <div style={styles.infoBox}>
        <h2>Datos Actuales en localStorage:</h2>
        {debugInfo.userId ? (
          <>
            <p>• userId: {debugInfo.userId}</p>
            <p>• userName: {debugInfo.userName}</p>
            <p>• userRole: {debugInfo.userRole}</p>
          </>
        ) : (
          <p>No hay datos de debug. Selecciona un rol para empezar.</p>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Acciones de Debug:</h2>
        <button style={styles.button} onClick={() => setupLocalStorage('mentor')}>
          Iniciar como Mentor
        </button>
        <button style={styles.button} onClick={() => setupLocalStorage('aprendiz')}>
          Iniciar como Aprendiz
        </button>
        <button style={{...styles.button, background: '#ff4d4d'}} onClick={clearLocalStorage}>
          Limpiar Datos
        </button>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Navegación:</h2>
        <button
          style={styles.button}
          onClick={() => navigate('/sala/test-room-1')}
          disabled={!debugInfo.userId}
        >
          Entrar a Sala de Prueba
        </button>
      </div>

      <div style={styles.instructions}>
        <h3>Instrucciones:</h3>
        <ol>
          <li>Selecciona un rol para guardar datos de prueba.</li>
          <li>Abre la consola del navegador (F12).</li>
          <li>Haz click en "Entrar a Sala de Prueba".</li>
          <li>Revisa los logs en la consola.</li>
        </ol>
      </div>
    </div>
  );
}

export default RoomDebug;
