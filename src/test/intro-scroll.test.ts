import { describe, expect, it } from "vitest";

import { introProgressFromScroll, introScrollDistance } from "@/lib/intro-scroll";

describe("studio intro scroll progress", () => {
  it("reduces mobile scroll sensitivity by exactly 20%", () => {
    expect(introScrollDistance(800, true)).toBe(1000);
    expect(introProgressFromScroll(200, introScrollDistance(800, true))).toBe(0.2);
  });

  it("leaves desktop scroll sensitivity unchanged", () => {
    expect(introScrollDistance(800, false)).toBe(800);
  });

  it("starts with the logo intro fully visible at the top of the page", () => {
    expect(introProgressFromScroll(0, 900)).toBe(0);
  });

  it("reveals the showreel gradually across the transition distance", () => {
    expect(introProgressFromScroll(225, 900)).toBe(0.25);
  });

  it("completes the logo transition when its full scroll distance is reached", () => {
    expect(introProgressFromScroll(900, 900)).toBe(1);
  });

  it("keeps the reveal complete beyond the transition distance", () => {
    expect(introProgressFromScroll(1200, 900)).toBe(1);
  });
});