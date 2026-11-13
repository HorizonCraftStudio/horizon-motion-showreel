import { useEffect, useRef } from "react";
import { studioReel } from "@/lib/media";
import { loadYouTubeAPI, type YouTubePlayer } from "@/lib/youtube";

export function ShowreelPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let disposed = false;
    let player: YouTubePlayer | undefined;

    void loadYouTubeAPI().then((api) => {
      const iframe = iframeRef.current;
      if (disposed || !iframe) return;
      player = new api.Player(iframe, {
        events: {
          onReady: ({ target }) => {
            target.mute();
            target.unloadModule("captions");
            target.playVideo();
          },
        },
      });
    });

    return () => {
      disposed = true;
      player?.destroy();
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={studioReel.url}
      title="Horizoncraft Studio showreel"
      allow="autoplay; encrypted-media; picture-in-picture"
      tabIndex={-1}
    />
  );
}