import React, { useState, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3-fixed';
import { Navigate } from 'react-router';

// Initialize recorder with a 32000 bitrate (or 128k)
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const RecordView = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blob, setBlob] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setIsBlocked(false))
      .catch(() => setIsBlocked(true));
  }, []);

  const startRecording = () => {
    if (isBlocked) {
      alert('Microphone permission denied!');
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e) => console.error(e));
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
    if (blob) {
      console.log('Store recordings');
      // Create FormData to hold the file payload
      const formData = new FormData();
      formData.append('audio', blob, 'recording.mp3');
      // Send request to the Node.js agent stream endpoint
      console.log('Send recordings');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/recordings`,
        {
          method: 'POST',
          body: formData,
        },
      ).catch((err) => {
        console.error('Error storing recordings:', err);
        setError(
          'Error storing recordings, check console log for more details...',
        );
      });

      if (response.ok) {
        alert('Recording successfully stored!');
        setError(null);
        setRedirect('/home');
      } else {
        setError(
          'Error storing recordings , check console log for more details...',
        );
      }
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 py-6 sm:max-w-lg sm:py-10">
      <div className="bg-base-200 border-base-300 rounded-box border p-5 sm:p-7">
        <header>
          <h2 className="font-serif text-base-content text-2xl sm:text-3xl">
            Record your take
          </h2>
          <p className="text-neutral mt-1 text-sm">
            Play along, then keep the version you like.
          </p>
        </header>

        {/* Live state — the only loud thing on the card */}
        <div className="mt-5 flex items-center gap-2 text-sm">
          <span
            className={`inline-block size-2.5 rounded-full ${
              isRecording ? 'bg-error animate-pulse' : 'bg-base-300'
            }`}
          />
          <span className={isRecording ? 'text-error' : 'text-neutral'}>
            {isRecording ? 'Recording…' : 'Ready'}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="btn btn-primary rounded-field font-semibold sm:flex-1"
          >
            Record
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="btn btn-outline btn-primary rounded-field font-semibold sm:flex-1"
          >
            Stop
          </button>
        </div>

        {blobURL && (
          <div className="border-base-300 bg-base-100 rounded-box mt-5 border p-3">
            <p className="text-neutral mb-2 text-xs tracking-wide uppercase">
              Your recording
            </p>
            <audio controls src={blobURL} className="w-full" />
          </div>
        )}

        <button
          onClick={saveRecording}
          disabled={!blob}
          className="btn btn-accent rounded-field mt-5 w-full font-semibold"
        >
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
    </section>
  );
};

export default RecordView;
