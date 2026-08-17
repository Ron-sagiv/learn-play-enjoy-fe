import React, { useState, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3-fixed';
import { Navigate } from 'react-router';

// Initialize recorder with a 32000 bitrate (or 128k)
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const RecordView=()=> {
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blob, setBlob] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState('');

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
        setBlob(blob);
        setIsRecording(false);
      })
      .catch((e) => console.log('A error occured: ', e));
  };

  const saveRecording = async (e) => {
    e.preventDefault();
    if(blob){
      console.log("Store recordings");
     // Create FormData to hold the file payload
        const formData = new FormData();
        formData.append('audio', blob, 'recording.mp3');
          // Send request to the Node.js agent stream endpoint
          console.log("Send recordings");
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/recordings`,{
          method: 'POST',
          body: formData,
        }).catch((err) => {
          console.error('Error storing recordings:', err);
          setError('Error storing recordings, check console log for more details...');
        });

        if (response.ok) {
          alert('Recording successfully stored!');
          setError(null);
          setRedirect('/home');
          
        } else {
          setError('Error storing recordings , check console log for more details...');
        }
      }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording} className="p-1 btn btn-sm text-primary font-semibold">
        Record
      </button>
      <div className="p-2"/>
      <button onClick={stopRecording} disabled={!isRecording} className="p-1 btn btn-sm text-primary font-semibold">
        Stop
      </button>
      {blobURL && <audio controls src={blobURL} />}
      <button onClick={saveRecording} disabled={ !blob} className="p-1 btn btn-sm text-primary font-semibold">
        Store
      </button>

      {error && (
          <div
            role="alert"
            className="bg-error/10 border-error/30 text-error rounded-field mt-6 border px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}
    </div>
  );
}

export default RecordView;