import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadYouTubeAPI, type YouTubePlayer } from "@/lib/youtube";

export function LaunchFilmPlayer({ videoId, title, onLoad }: {
  videoId: string;
  title: string;
  onLoad: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let player: YouTubePlayer | undefined;
    void loadYouTubeAPI().then((api) => {
      const iframe = iframeRef.current;
      if (disposed || !iframe) return;
      player = new api.Player(iframe, { events: {
        onReady: ({ target }) => {
          if (disposed) return;
          playerRef.current = target;
          target.mute();
          target.unloadModule("captions");
          target.playVideo();
          setReady(true);
        },
        onStateChange: ({ data }) => {
          if (!disposed) setPlaying(data === 1 || data === 3);
        },
        onError: () => { if (!disposed) setFailed(true); },
      } });
    });
    return () => { disposed = true; playerRef.current = null; player?.destroy(); };
  }, [videoId]);

  return (
    <div className="film-frame">
      <iframe ref={iframeRef} onLoad={onLoad}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1&controls=0&playsinline=1&disablekb=1&fs=0&rel=0&iv_load_policy=3&cc_load_policy=0`}
        title={`${title} launch film`} allow="autoplay; encrypted-media" tabIndex={-1}
        referrerPolicy="strict-origin-when-cross-origin" />
      <div className="film-controls" role="group" aria-label={`${title} playback controls`}>
        <Button variant="ghost" size="icon" disabled={!ready || failed}
          aria-label={playing ? "Pause" : "Play"} title={playing ? "Pause" : "Play"}
          onClick={() => { const player = playerRef.current; if (!player) return; if (playing) player.pauseVideo(); else player.playVideo(); }}>
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button variant="ghost" size="icon" disabled={!ready || failed}
          aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Unmute" : "Mute"}
          onClick={() => { const player = playerRef.current; if (!player) return; if (muted) player.unMute(); else player.mute(); setMuted(!muted); }}>
          {muted ? <VolumeX /> : <Volume2 />}
        </Button>
        {failed && <span role="alert">Video unavailable</span>}
      </div>
    </div>
  );
}