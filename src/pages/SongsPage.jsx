import React, { useState, useEffect } from "react";

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/songs`);
        if (!response.ok) throw new Error("Failed to fetch songs");
        const data = await response.json();
        setSongs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) return <div className="text-white p-6 text-center">Loading songs and tutorials...</div>;
  if (error) return <div className="text-red-500 p-6 text-center">Error: {error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Guitar Lesson Tutorials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <div key={song.id} className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-1">{song.title}</h3>
            <p className="text-indigo-400 font-medium mb-2">{song.artist}</p>
            <div className="text-sm text-gray-300 mb-4 space-y-1">
              <p><span className="text-gray-500">Genre:</span> {song.genre}</p>
              <p><span className="text-gray-500">Difficulty:</span> {song.difficulty}</p>
              <p><span className="text-gray-500">Tab:</span> {song.tabContent}</p>
            </div>
            
            <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Tutorial Videos:</h4>
            <ul className="space-y-1">
              {song.videoUrls && song.videoUrls.map((url, idx) => (
                <li key={idx}>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm truncate block"
                  >
                    Watch Video #{idx + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}