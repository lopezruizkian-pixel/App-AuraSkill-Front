import { useEffect, useContext, useRef } from 'react';
import { RoomContext } from '../context/RoomContext';

// Hook para manejar stream local (video/audio)
export const useLocalStream = () => {
  const { setLocalStream, setError, videoEnabled, audioEnabled } =
    useContext(RoomContext);

  const localStreamRef = useRef(null);

  useEffect(() => {
    // Solo pedir stream si tenemos permisos
    if (!videoEnabled && !audioEnabled) {
      console.log('[LocalStream] Video y audio deshabilitados, omitiendo stream');
      return;
    }

    let isMounted = true;

    const getLocalStream = async () => {
      try {
        // Solicitar acceso a cámara y micrófono
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
          audio: audioEnabled,
        });

        if (!isMounted) return;

        localStreamRef.current = stream;
        setLocalStream(stream);

        console.log('[LocalStream] Stream obtenido:', stream.getTracks());
      } catch (err) {
        console.error('[LocalStream] Error obteniendo stream:', err);

        if (!isMounted) return;

        if (err.name === 'NotAllowedError') {
          setError('Debes permitir acceso a cámara y micrófono');
        } else if (err.name === 'NotFoundError') {
          setError('No se encontró cámara o micrófono');
        } else {
          setError('Error accediendo a dispositivos');
        }
      }
    };

    getLocalStream();

    // Cleanup
    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        console.log('[LocalStream] Stream detenido');
      }
    };
  }, [videoEnabled, audioEnabled, setLocalStream, setError]);

  // Función para toggle video
  const toggleVideoTrack = (enabled) => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  };

  // Función para toggle audio
  const toggleAudioTrack = (enabled) => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  };

  return {
    localStream: localStreamRef.current,
    toggleVideoTrack,
    toggleAudioTrack,
  };
};
