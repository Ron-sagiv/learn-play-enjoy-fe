//getting last song learned on home page.

const LAST_SONG_KEY = 'lpe_last_song';

// Called from SingleSongPage when a song is opened.
export function saveLastSong(song) {
  if (!song?.id) return;
  localStorage.setItem(
    LAST_SONG_KEY,
    JSON.stringify({ id: song.id, title: song.title, artist: song.artist }),
  );
}

// Returns { id, title, artist } or null if nothing was saved yet.
export function getLastSong() {
  try {
    return JSON.parse(localStorage.getItem(LAST_SONG_KEY)) || null;
  } catch {
    return null;
  }
}
