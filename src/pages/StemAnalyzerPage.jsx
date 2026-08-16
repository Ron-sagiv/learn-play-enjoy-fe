import { useState, useEffect } from 'react';
import StemCard from '../components/StemCard';
import { NavLink } from 'react-router';
import { useAuthenticationContext } from '../context/AuthenticationContext';
import RecordView from '../components/Recorder';

const StemAnalyzer = () => {
    const  {user}  = useAuthenticationContext();
    const isAuthenticated = !!user;
    const [audiofiles, setAudiofiles] = useState([]);
    const [error, setError] = useState(null);
useEffect(() => {
  if(isAuthenticated){
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/audiofiles`)
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
    <h1 className="text-2xl font-bold mb-4">All process files</h1>
    <div className='p-2'><NavLink to="/createstem" className="btn gap-1 px-2 text-xl font-bold">
                Create New Stem
              </NavLink></div>
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,30rem)]">
      { audiofiles.map((stem) => (
        <StemCard key={stem.id} stem={stem} />
      ))}
    </div>
    <div className="text-red-500 mt-2">
        {error && <p>{error}</p>} 
    </div>

    <div><RecordView/></div>

  </div>
  
);
};

export default StemAnalyzer;