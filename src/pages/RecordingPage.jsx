import { useState, useEffect } from 'react';
import StemCard from '../components/StemCard';
import { NavLink,Navigate } from 'react-router';
import { useAuthenticationContext } from '../context/AuthenticationContext';
import RecordView from '../components/Recorder';
import MusicPlayer from '../components/PlaySong';

const RecordingPage = () => {
    const  {user}  = useAuthenticationContext();
    const isAuthenticated = !!user;
    const [audiofiles, setAudiofiles] = useState([]);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState('');

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

const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recorded song?'))
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/recordings/${id}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        alert('Audio Records deleted successfully!');
        setRedirect('/home');
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        alert('Failed to delete audiofile.');
      }
    } catch (error) {
      console.error('Error deleting audiofile:', error);
      setError(
        'Error deleting audiofile , check console log for more details...',
      );
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

    return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All recorded files</h1>
        
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,30rem)]">
        { audiofiles.map((song) => (
            <div key={song.id}>
                <h1>OriginalName: </h1>{song.originalName} <MusicPlayer link={song.filePath}/>
                <div className="mt-10 border-t border-base-300 pt-6" id={song.id}>
                    <button  onClick={()=>handleDelete(song.id)} className="btn btn-sm btn-outline btn-error w-full sm:w-auto" >
                        Delete audio records
                    </button>
                </div>
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