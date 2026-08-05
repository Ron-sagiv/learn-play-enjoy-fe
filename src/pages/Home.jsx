import { useState, useEffect } from 'react';

const Home = () => {
   
    const [error, setError] = useState(null);
    

    return (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Music learn</h1>
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,30rem)]">
      
    </div>
    <div className="text-red-500 mt-2">
        {error && <p>{error}</p>} 
    </div>
  </div>
  
);
};

export default Home;