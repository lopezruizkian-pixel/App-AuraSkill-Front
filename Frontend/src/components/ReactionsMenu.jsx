import React, { useState, useContext } from 'react';
import { Laugh, ThumbsUp, Heart, Flame, Smile } from 'lucide-react';
import '../Styles/RoomComponents.css';

const REACTIONS = [
  { emoji: '👍', name: 'Like', icon: ThumbsUp },
  { emoji: '❤️', name: 'Love', icon: Heart },
  { emoji: '😂', name: 'Laugh', icon: Laugh },
  { emoji: '🔥', name: 'Fire', icon: Flame },
  { emoji: '😊', name: 'Smile', icon: Smile },
];

function ReactionsMenu({ onReactionSelect, isOpen, setIsOpen }) {
  return (
    <div className={`reactions-menu ${isOpen ? 'open' : ''}`}>
      <div className="reactions-menu-content">
        {REACTIONS.map((reaction) => (
          <button
            key={reaction.emoji}
            className="reaction-btn"
            onClick={() => {
              onReactionSelect(reaction.emoji);
              setIsOpen(false);
            }}
            title={reaction.name}
            aria-label={reaction.name}
          >
            <span className="reaction-emoji-large">{reaction.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ReactionsMenu;
