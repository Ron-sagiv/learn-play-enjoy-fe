const KEY = 'savedSongs';

export const getSavedSongs = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};

export const isSongSaved = (id) => getSavedSongs().some((s) => s.id === id);

export const saveSong = (song) => {
  const songs = getSavedSongs();
  if (songs.some((s) => s.id === song.id)) return songs;

  // store only what the Home list needs, not the whole song
  const next = [
    ...songs,
    {
      id: song.id,
      title: song.title,
      artist: song.artist,
      difficulty: song.difficulty,
      genre: song.genre,
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const removeSavedSong = (id) => {
  const next = getSavedSongs().filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};
