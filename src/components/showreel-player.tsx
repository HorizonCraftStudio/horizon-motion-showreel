import { useEffect, useRef } from "react";
import { studioReel } from "@/lib/media";

interface Player {
  mute(): void;
  playVideo(): void;
  unloadModule(module: string): void;
  destroy(): void;
}

interface YouTubeAPI {
  Player: new (element: HTMLIFrameElement, options: {
    events: {
      onReady(event: { target: Player }): void;
    };
  }) => Player;
}

type YouTubeWindow = Window & {
  YT?: YouTubeAPI;
  onYouTubeIframeAPIReady?: () => void;
};

let apiPromise: Promise<YouTubeAPI> | undefined;

function loadYouTubeAPI() {
  const browser = window as YouTubeWindow;
  if (browser.YT?.Player) return Promise.resolve(browser.YT);
  if (!apiPromise) {
    apiPromise = new Promise<YouTubeAPI>((resolve) => {
      const previousReady = browser.onYouTubeIframeAPIReady;
      browser.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        if (browser.YT?.Player) resolve(browser.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

export function ShowreelPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let disposed = false;
    let player: Player | undefined;

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