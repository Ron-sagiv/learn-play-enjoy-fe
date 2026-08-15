import { useAuthenticationContext } from '../context/AuthenticationContext';
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router';
import { NavLink } from 'react-router';

import MusicPlayer from '../components/PlaySong';

const StemDetails = () => {
  const  {user}  = useAuthenticationContext();
  const isAuthenticated = !!user;
  const { id } = useParams();
  const [audiofile, setAudiofile] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [redirect,setRedirect]=useState('');
  const [filename,setFilename]=useState('');

  

  useEffect(() => {
    if(isAuthenticated){
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/audiofiles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log('data:', data);
        let inFile=data.inputFile
        //console.log('inFile:', inFile);
        inFile=inFile.split("/").pop();
        //console.log('inFile:', inFile);
        setFilename(inFile);
        setAudiofile(data);
        setError(null);
      })
      .catch((err) => {
        setError(
          'Error fetching audio file details , check console log for more details...',
        );
      });
      }
  }, [id]);

  if (error) {
    return <div className="text-red-500 mt-2">{error && <p>{error}</p>}</div>;
  }

  if (!audiofile) {
    return <p>Loading....</p>;
  }
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analyzed song?')) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/audiofiles/${id}`, {
          method: 'DELETE',
          
        });

        if (response.ok) {
          alert('Audio Records deleted successfully!');
          setRedirect('/stems');
        } else {
          const errorData = await response.json();
          console.error('Delete failed:', errorData);
          alert('Failed to delete audiofile.');
        }
      } catch (error) {
        console.error('Error deleting audiofile:', error);
        setError('Error deleting audiofile , check console log for more details...');
      }
  };
  

    if(redirect){
        return <Navigate to={redirect} />;
    }

  return (
    <div>
    

    <NavLink to="/stems" className="btn gap-1 px-2 text-xl font-bold">
                Back to StemAnalyzer
    </NavLink>

    <div className="card ">
      <div className="">
        
       
          <div className="p-2 text-center">
            <h1 className='text-xl font-bold mb-4'>Details: Listen the original and the Guitar </h1>
          </div>
            
            <div className="p-2">
            <div className="bg-base-200 border-base-300 rounded-box border p-4 sm:p-6">
              <h2>Original file :</h2>
              <a href={audiofile.inputFile}>{audiofile.inputFile?.split('-')[1]}</a>
              <MusicPlayer link={audiofile.inputFile}/>
            </div>  
            </div> 
            
            <br/>


            <div className="p-2">
            <div className="bg-base-200 border-base-300 rounded-box border p-4 sm:p-6">
              <h2>After Stem Analyzed Guitar file :</h2>
              <a href={audiofile.outputFile}>{audiofile.outputFile?.split('-')[1]}</a>
              <MusicPlayer link={audiofile.outputFile}/>
            </div>
            </div>
           

         
          </div>

        <br/>
        
        <div className="p-2">
          <button onClick={handleDelete} className="p-1 btn btn-sm text-primary font-semibold">
            Delete Audio Records
          </button>
        </div>
    </div>
    </div>
  );

}

export default StemDetails;