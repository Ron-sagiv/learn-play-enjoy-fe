import { useState, useEffect } from 'react';
import StemCard from '../components/StemCard';
import { NavLink } from 'react-router';
import { useAuthenticationContext } from '../context/AuthenticationContext';
import RecordView from '../components/Recorder';
import MusicPlayer from '../components/PlaySong';

const RecordingPage = () => {
    const  {user}  = useAuthenticationContext();
    const isAuthenticated = !!user;
    const [audiofiles, setAudiofiles] = useState([]);
    const [error, setError] = useState(null);
useEffect(() => {
  if(isAuthenticated){
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recordings`)
    .then((res) => res.json())
    .then((data) => {
        //console.log(data);
        const records = data;
        setAudiofiles(records);
        setError(null);
    })
    .catch((err) => {
      console.error("Error fetching audiofiles:", err);
      setError("Error fetching audiofiles , check console log for more details...");
    });
}}, []);

    
    return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All recorded files</h1>
        
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,30rem)]">
        { audiofiles.map((song) => (
            <div id={song.id}>
                <h1>OriginalName: </h1>{song.originalName} <MusicPlayer link={song.filePath}/>
            </div>
        ))}
        </div>
        <div className="text-red-500 mt-2">
            {error && <p>{error}</p>} 
        </div>

        <div><RecordView/></div>

  </div>
  
);
};

export default RecordingPage;