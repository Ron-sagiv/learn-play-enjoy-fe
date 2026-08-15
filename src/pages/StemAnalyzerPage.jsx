import { useState, useEffect } from 'react';
import StemCard from '../components/StemCard';
import { NavLink } from 'react-router';

const StemAnalyzer = () => {
    const [audiofiles, setAudiofiles] = useState([]);
    const [error, setError] = useState(null);
useEffect(() => {
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
    }, []);

    
    return (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">All process files</h1>
    <div><NavLink to="/createstem" className="">
                Create New Stem
              </NavLink></div>
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,30rem)]">
      {audiofiles.map((stem) => (
        <StemCard key={stem.id} stem={stem} />
      ))}
    </div>
    <div className="text-red-500 mt-2">
        {error && <p>{error}</p>} 
    </div>
  </div>
  
);
};

export default StemAnalyzer;