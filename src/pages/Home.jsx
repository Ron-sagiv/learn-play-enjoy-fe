import { useState, useEffect } from 'react';
import MyChatBot from '../components/ChatBot';
import UserDetails from '../components/User';

const Home = () => {
   
    const [error, setError] = useState(null);
    

    return (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Welcome</h1>
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,30rem)]">
      <div >
        <UserDetails/>
      </div>
      <div >
        <MyChatBot/>
      </div>
    </div>
    <div className="text-red-500 mt-2">
        {error && <p>{error}</p>} 
    </div>
  </div>
  
);
};

export default Home;