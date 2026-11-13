import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShowreelPlayer } from "@/components/showreel-player";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  Reflect.deleteProperty(window, "YT");
});

describe("showreel playback readiness", () => {
  it("waits for sustained playback rather than revealing after iframe load", async () => {
    vi.useFakeTimers();
    let changeState: ((event: { data: number }) => void) | undefined;
    const destroy = vi.fn();
    Object.assign(window, {
      YT: {
        Player: class {
          constructor(_iframe: HTMLIFrameElement, options: {
            events: { onStateChange(event: { data: number }): void };
          }) {
            changeState = options.events.onStateChange;
          }
          destroy = destroy;
        },
      },
    });
    const { container, unmount } = render(<ShowreelPlayer />);
    await act(async () => {});
    const iframe = container.querySelector("iframe");
    if (!iframe || !changeState) throw new Error("Player did not mount");
    const state = changeState;
    act(() => { vi.advanceTimersByTime(10000); });
    expect(iframe.classList.contains("is-ready")).toBe(false);
    act(() => { state({ data: 1 }); vi.advanceTimersByTime(3000); });
    expect(iframe.classList.contains("is-ready")).toBe(false);
    act(() => { state({ data: 3 }); vi.advanceTimersByTime(5000); });
    expect(iframe.classList.contains("is-ready")).toBe(false);
    act(() => { state({ data: 1 }); vi.advanceTimersByTime(4000); });
    expect(iframe.classList.contains("is-ready")).toBe(true);
    act(() => { state({ data: 2 }); });
    expect(iframe.classList.contains("is-ready")).toBe(false);
    unmount();
    expect(destroy).toHaveBeenCalledOnce();
  });
});