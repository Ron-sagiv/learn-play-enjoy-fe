import { useAuthenticationContext } from '../context/AuthenticationContext';
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router';
import { NavLink } from 'react-router';

import MusicPlayer from '../components/PlaySong';

const StemDetails = () => {
  //const { token } = useAuthenticationContext();
  const { id } = useParams();
  const [audiofile, setAudiofile] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [redirect,setRedirect]=useState('');
  const [filename,setFilename]=useState('');

  

  useEffect(() => {
    //console.log("id:", id);
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
        //console.error('Error fetching audiofile details:', err);
        setError(
          'Error fetching audio file details , check console log for more details...',
        );
      });
  }, [id]);

  if (error) {
    return <div className="text-red-500 mt-2">{error && <p>{error}</p>}</div>;
  }

  if (!audiofile) {
    return <p>Loading....</p>;
  }
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analyzed song?')) return;

   // const token=JSON.parse(localStorage.getItem('token')) || '';
    //console.log("token:",token);
   // if(token){
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/audiofiles/${id}`, {
          method: 'DELETE',
          headers: {
            //Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert('Audio Records deleted successfully!');
          //window.location.href = '/';
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
   // }else{
      //window.location.href = '/login';
     // setRedirect('/login');
    // }
  };
  

    if(redirect){
        return <Navigate to={redirect} />;
    }

  return (
    <div>
    

    <NavLink to="/stems" className="btn btn-ghost gap-1 px-2 text-xl font-bold">
                Go to StemAnalyzer
    </NavLink>

    <div className="">
      <div className="">
        <h1 className="">{filename}</h1>
       
          <div className="">
            Details: 
          </div>
            <div className="">
            Input file link: {audiofile.inputFile} <div className="bg-base-200 border-base-300 rounded-box border p-4 sm:p-6">
          <MusicPlayer link={audiofile.inputFile}/>
        </div>
          </div>

          <div className="">
            Output file link: {audiofile.outputFile} <div className="bg-base-200 border-base-300 rounded-box border p-4 sm:p-6">
          <MusicPlayer link={audiofile.outputFile}/>
        </div>
          </div>


        
        <div className="">
          <button onClick={handleDelete} className="">
            Delete Audio Records
          </button>
        </div>
      </div>
    </div>
    </div>
  );

}

export default StemDetails;