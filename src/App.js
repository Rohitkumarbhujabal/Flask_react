import React, { useState } from 'react';
import OverlayManagement from './components/OverlayManagement';
import './App.css';

function App() {
  const [rtspUrl, setRtspUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="App">
      <header>
        <h1 className="app-title">RTSP Video Player</h1>
      </header>
      <div className="video-controls">
        <input
          type="text"
          className="rtsp-input"
          placeholder="Enter RTSP URL"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
        />
        <button className="play-button" onClick={handlePlay}>Play</button>
        <button className="pause-button" onClick={handlePause}>Pause</button>
      </div>

      <div className="video-container">
        {isPlaying ? (
          <video className="video-player" controls width="640" height="360">
            <source src="http://techslides.com/demos/sample-videos/small.mp4" type="application/x-rtsp" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="no-video-text">No video is playing.</p>
        )}
      </div>

      <main>
        <OverlayManagement />
      </main>
    </div>
  );
}

export default App;
