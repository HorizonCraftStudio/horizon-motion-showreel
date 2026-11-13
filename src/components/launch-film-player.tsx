import { launchFilmUrl } from "@/lib/launch-film";

export function LaunchFilmPlayer({ videoId, title, onLoad }: {
  videoId: string;
  title: string;
  onLoad: () => void;
}) {
  return (
    <div className="film-frame">
      <iframe onLoad={onLoad} src={launchFilmUrl(videoId)}
        title={`${title} launch film`} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </div>
  );
}