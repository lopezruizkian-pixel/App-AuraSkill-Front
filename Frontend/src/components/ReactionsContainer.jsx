import React, { useContext, useEffect, useState } from 'react';
import { RoomContext } from '../context/RoomContext';
import '../Styles/RoomComponents.css';

function ReactionsContainer() {
  const { reactions } = useContext(RoomContext);
  const [displayReactions, setDisplayReactions] = useState([]);

  useEffect(() => {
    // Mostrar nuevas reacciones con animación
    if (reactions.length > displayReactions.length) {
      const newReactions = reactions.slice(displayReactions.length);
      setDisplayReactions((prev) => [...prev, ...newReactions]);
    }
  }, [reactions, displayReactions.length]);

  // Auto-remover reacciones después de 3 segundos
  useEffect(() => {
    if (displayReactions.length === 0) return;

    const timer = setTimeout(() => {
      setDisplayReactions([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [displayReactions]);

  if (displayReactions.length === 0) return null;

  return (
    <div className="reactions-container">
      {displayReactions.map((reaction, index) => (
        <div
          key={`${reaction.id}-${index}`}
          className="reaction-bubble"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <span className="reaction-emoji">{reaction.emoji}</span>
          <p className="reaction-user">{reaction.userName}</p>
        </div>
      ))}
    </div>
  );
}

export default ReactionsContainer;
