import { expect, it } from "vitest";
import { launchFilmUrl } from "@/lib/launch-film";

it("disables autoplay for every launch film", () => {
  for (const id of ["qYks1zCuC28", "G9aDGM9YRxU", "Q8hsB0BFU1E"]) {
    expect(new URL(launchFilmUrl(id)).searchParams.get("autoplay")).toBe("0");
  }
});

it("uses standard YouTube controls", () => {
  expect(new URL(launchFilmUrl("qYks1zCuC28")).searchParams.get("controls")).toBe("1");
});