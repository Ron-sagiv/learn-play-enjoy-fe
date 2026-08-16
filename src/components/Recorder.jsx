import React, { useState, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3-fixed';

// Initialize recorder with a 32000 bitrate (or 128k)
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const RecordView=()=> {
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setIsBlocked(false))
      .catch(() => setIsBlocked(true));
  }, []);

  const startRecording = () => {
    if (isBlocked) {
      alert('Microphone permission denied!');
    } else {
      Mp3Recorder.start().then(() => {
        setIsRecording(true);
      }).catch((e) => console.error(e));
    }
  };

  const stopRecording = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const audioUrl = URL.createObjectURL(blob);
        setBlobURL(audioUrl);
        setIsRecording(false);
      })
      .catch((e) => console.log('A error occured: ', e));
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording} className="p-1 btn btn-sm text-primary font-semibold">
        Record
      </button>
      <div classname="p-2"/>
      <button onClick={stopRecording} disabled={!isRecording} className="p-1 btn btn-sm text-primary font-semibold">
        Stop
      </button>
      {blobURL && <audio controls src={blobURL} />}
    </div>
  );
}

export default RecordView;