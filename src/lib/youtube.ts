export interface YouTubePlayer {
  mute(): void;
  unMute(): void;
  playVideo(): void;
  pauseVideo(): void;
  unloadModule(module: string): void;
  destroy(): void;
}

interface YouTubeAPI {
  Player: new (element: HTMLIFrameElement, options: {
    events: {
      onReady(event: { target: YouTubePlayer }): void;
      onStateChange?(event: { data: number }): void;
      onError?(): void;
    };
  }) => YouTubePlayer;
}

type YouTubeWindow = Window & {
  YT?: YouTubeAPI;
  onYouTubeIframeAPIReady?: () => void;
};

let apiPromise: Promise<YouTubeAPI> | undefined;

export function loadYouTubeAPI() {
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