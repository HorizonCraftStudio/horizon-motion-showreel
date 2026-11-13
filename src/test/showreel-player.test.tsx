import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShowreelPlayer } from "@/components/showreel-player";
import type { YouTubePlayer } from "@/lib/youtube";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  Reflect.deleteProperty(window, "YT");
  vi.restoreAllMocks();
});

describe("showreel playback startup", () => {
  it("starts muted playback immediately when YouTube is ready without a settling timer", async () => {
    vi.useFakeTimers();
    const mute = vi.fn();
    const unloadModule = vi.fn();
    const playVideo = vi.fn();
    const destroy = vi.fn();
    Object.assign(window, {
      YT: {
        Player: class {
          constructor(_iframe: HTMLIFrameElement, options: {
            events: { onReady(event: { target: { mute(): void; unloadModule(module: string): void; playVideo(): void } }): void };
          }) {
            options.events.onReady({ target: { mute, unloadModule, playVideo } });
          }
          destroy = destroy;
        },
      },
    });
    const { unmount } = render(<ShowreelPlayer />);
    await act(async () => {});
    expect(mute).toHaveBeenCalledOnce();
    expect(unloadModule).toHaveBeenCalledWith("captions");
    expect(playVideo).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
    unmount();
    expect(destroy).toHaveBeenCalledOnce();
  });

  it("resumes muted playback after pauses and tab returns without restarting for buffering", async () => {
    const target: YouTubePlayer = {
      mute: vi.fn(), unMute: vi.fn(), playVideo: vi.fn(),
      pauseVideo: vi.fn(), unloadModule: vi.fn(), destroy: vi.fn(),
    };
    let stateChange: ((event: { data: number }) => void) | undefined;
    Object.assign(window, {
      YT: {
        Player: class {
          constructor(_iframe: HTMLIFrameElement, options: {
            events: {
              onReady(event: { target: YouTubePlayer }): void;
              onStateChange?(event: { data: number }): void;
            };
          }) {
            stateChange = options.events.onStateChange;
            options.events.onReady({ target });
          }
          destroy = target.destroy;
        },
      },
    });
    const visibility = vi.spyOn(document, "visibilityState", "get");
    visibility.mockReturnValue("visible");
    const { unmount } = render(<ShowreelPlayer />);
    await act(async () => {});
    act(() => stateChange?.({ data: 2 }));
    expect(target.playVideo).toHaveBeenCalledTimes(2);
    act(() => stateChange?.({ data: 3 }));
    expect(target.playVideo).toHaveBeenCalledTimes(2);
    visibility.mockReturnValue("hidden");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(target.playVideo).toHaveBeenCalledTimes(2);
    visibility.mockReturnValue("visible");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(target.playVideo).toHaveBeenCalledTimes(3);
    act(() => window.dispatchEvent(new Event("focus")));
    expect(target.playVideo).toHaveBeenCalledTimes(4);
    act(() => window.dispatchEvent(new Event("pageshow")));
    expect(target.playVideo).toHaveBeenCalledTimes(5);
    expect(target.mute).toHaveBeenCalledTimes(5);
    unmount();
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("focus"));
      window.dispatchEvent(new Event("pageshow"));
      stateChange?.({ data: 2 });
    });
    expect(target.playVideo).toHaveBeenCalledTimes(5);
    expect(target.destroy).toHaveBeenCalledOnce();
  });
});