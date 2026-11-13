import { useEffect, useRef } from "react";
import { studioReel } from "@/lib/media";
import { loadYouTubeAPI, type YouTubePlayer } from "@/lib/youtube";

export function ShowreelPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let disposed = false;
    let player: YouTubePlayer | undefined;
    let readyPlayer: YouTubePlayer | undefined;

    const resumePlayback = () => {
      if (disposed || !readyPlayer) return;
      readyPlayer.mute();
      readyPlayer.playVideo();
    };
    const resumeWhenVisible = () => {
      if (document.visibilityState === "visible") resumePlayback();
    };

    document.addEventListener("visibilitychange", resumeWhenVisible);
    window.addEventListener("focus", resumeWhenVisible);
    window.addEventListener("pageshow", resumeWhenVisible);

    void loadYouTubeAPI().then((api) => {
      const iframe = iframeRef.current;
      if (disposed || !iframe) return;
      player = new api.Player(iframe, {
        events: {
          onReady: ({ target }) => {
            if (disposed) return;
            readyPlayer = target;
            target.mute();
            target.unloadModule("captions");
            target.playVideo();
          },
          onStateChange: ({ data }) => {
            // YouTube can pause after a tab switch; request playback again,
            // without treating buffering as a pause or delaying the reveal.
            if (data === 2) resumePlayback();
          },
        },
      });
    });

    return () => {
      disposed = true;
      readyPlayer = undefined;
      document.removeEventListener("visibilitychange", resumeWhenVisible);
      window.removeEventListener("focus", resumeWhenVisible);
      window.removeEventListener("pageshow", resumeWhenVisible);
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