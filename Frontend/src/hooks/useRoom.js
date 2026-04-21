import { useEffect, useContext } from 'react';
import { RoomContext } from '../context/RoomContext';
import { fetchRoom } from '../services/roomService';

// Hook para cargar datos de la sala
export const useRoom = (roomId) => {
  const { setRoomData, setSessionInfo } = useContext(RoomContext);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const loadRoom = async () => {
      let roomDataToSave = null;
      try {
        const data = await fetchRoom(roomId);
        setRoomData(data);
        setSessionInfo(data?.sessionInfo || null);
        roomDataToSave = data;
      } catch (err) {
        console.warn('No se pudo cargar sala, usando datos por defecto:', err.message);
        roomDataToSave = {
          id: roomId,
          nombre: `Sala: ${roomId}`,
          habilidad: 'Mentoria en vivo',
          mentor: 'Mentor Anonimo',
          descripcion: 'Sesion de mentoria en tiempo real',
        };
        setRoomData(roomDataToSave);
        setSessionInfo(null);
      }
      
      const role = localStorage.getItem("userRole") || "alumno";
      if (role === "alumno" && roomDataToSave) {
        const nuevaSalaHistorial = {
          id: roomDataToSave.id || roomId,
          fecha: new Date().toISOString(),
          nombreSala: roomDataToSave.nombre || `Sala: ${roomId}`,
          habilidad: roomDataToSave.habilidad || 'Mentoria en vivo',
          mood: roomDataToSave.mood || 'Sin mood',
          mentor: roomDataToSave.mentor_nombre || roomDataToSave.mentor?.nombre || roomDataToSave.mentor || 'Mentor Anonimo',
          duracion: 0
        };
        const historialGuardado = JSON.parse(localStorage.getItem("historialSalas")) || [];
        const filteredHistory = historialGuardado.filter(s => s.id !== nuevaSalaHistorial.id);
        localStorage.setItem("historialSalas", JSON.stringify([nuevaSalaHistorial, ...filteredHistory]));
      }
    };

    loadRoom();
  }, [roomId, setRoomData, setSessionInfo]);

  return { isLoading: false };
};
