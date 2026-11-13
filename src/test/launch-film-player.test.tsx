import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LaunchFilmPlayer } from "@/components/launch-film-player";

afterEach(() => { cleanup(); Reflect.deleteProperty(window, "YT"); });

it("controls playback and audio through YouTube and disposes the player", async () => {
  let state: ((event: { data: number }) => void) | undefined;
  const player = { mute: vi.fn(), unMute: vi.fn(), playVideo: vi.fn(), pauseVideo: vi.fn(), unloadModule: vi.fn(), destroy: vi.fn() };
  Object.assign(window, { YT: { Player: class {
    constructor(_element: HTMLIFrameElement, options: { events: { onReady(event: { target: typeof player }): void; onStateChange(event: { data: number }): void } }) {
      state = options.events.onStateChange;
      options.events.onReady({ target: player });
    }
    destroy = player.destroy;
  } } });
  const view = render(<LaunchFilmPlayer videoId="qYks1zCuC28" title="KQi Air X" onLoad={() => {}} />);
  await act(async () => {});
  expect(player.playVideo).toHaveBeenCalledOnce();
  fireEvent.click(view.getByRole("button", { name: "Play" }));
  expect(player.playVideo).toHaveBeenCalledTimes(2);
  act(() => state?.({ data: 1 }));
  fireEvent.click(view.getByRole("button", { name: "Pause" }));
  expect(player.pauseVideo).toHaveBeenCalledOnce();
  fireEvent.click(view.getByRole("button", { name: "Unmute" }));
  expect(player.unMute).toHaveBeenCalledOnce();
  fireEvent.click(view.getByRole("button", { name: "Mute" }));
  expect(player.mute).toHaveBeenCalledTimes(2);
  view.unmount();
  expect(player.destroy).toHaveBeenCalledOnce();
});