export function introProgressFromScroll(scrollY: number, transitionDistance: number) {
  const distance = Math.max(1, transitionDistance);
  return Math.max(0, Math.min(1, scrollY / distance));
}