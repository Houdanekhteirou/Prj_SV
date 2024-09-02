// components/ProgressBar.js

import React, { useEffect, useState } from 'react';

const ProgressBar = () => {
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    const socket = new WebSocket('ws://'); // 192.168.100.68:8080

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    socket.onmessage = (event) => {
      console.log('WebSocket message:', event.data);

      // const progressData = JSON.parse(event.data);

      return
      setUploadProgress(prevState => ({
        ...prevState,
        [progressData.fileId]: progressData.progress
      }));
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      {Object.entries(uploadProgress).map(([fileId, progress]) => (
        <div key={fileId}>
          <h2>File {fileId}: {progress.toFixed(2)}%</h2>
          <div
            style={{
              width: '100%',
              height: '30px',
              background: '#ddd',
              borderRadius: '5px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#4caf50',
                transition: 'width 0.5s ease-in-out',
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
