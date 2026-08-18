import React, { useState, useRef } from 'react';

export default function MusicPlayer({link}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <audio 
        ref={audioRef} 
        src={link} 
      />
      <button onClick={togglePlay} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {isPlaying ? 'Pause⏸️' : 'Play▶'}
      </button>
    </div>
  );
}