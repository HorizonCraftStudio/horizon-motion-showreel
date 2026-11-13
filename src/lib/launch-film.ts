export function launchFilmUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=0&controls=1&playsinline=1`;
}