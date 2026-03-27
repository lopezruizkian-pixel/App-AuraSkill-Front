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
      try {
        const data = await fetchRoom(roomId);
        setRoomData(data);
        setSessionInfo(data?.sessionInfo || null);
      } catch (err) {
        console.warn('No se pudo cargar sala, usando datos por defecto:', err.message);
        setRoomData({
          id: roomId,
          nombre: `Sala: ${roomId}`,
          habilidad: 'Mentoria en vivo',
          mentor: 'Mentor Anonimo',
          descripcion: 'Sesion de mentoria en tiempo real',
        });
        setSessionInfo(null);
      }
    };

    loadRoom();
  }, [roomId, setRoomData, setSessionInfo]);

  return { isLoading: false };
};
