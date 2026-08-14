// Works with watch?v=, youtu.be/ and embed/ links; extra params like &pp= are ignored.
export const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return match ? match[1] : null;
};

export const getThumbnailUrl = (id) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const getEmbedUrl = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
