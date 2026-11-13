import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShowreelPlayer } from "@/components/showreel-player";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  Reflect.deleteProperty(window, "YT");
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
});