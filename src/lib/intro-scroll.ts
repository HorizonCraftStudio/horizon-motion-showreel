export function introProgressFromScroll(scrollY: number, transitionDistance: number) {
  const distance = Math.max(1, transitionDistance);
  return Math.max(0, Math.min(1, scrollY / distance));
}

export function introScrollDistance(baseDistance: number, isMobile: boolean) {
  return baseDistance / (isMobile ? 0.8 : 1);
}