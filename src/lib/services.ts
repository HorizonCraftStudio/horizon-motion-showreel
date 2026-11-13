export const services = [
  {
    title: "Product launch film",
    text: "Cinematic 3D films that introduce your product to the world.",
    showcase: "film",
  },
  {
    title: "Product PDP",
    text: "Every 3D render, loop and detail view your product page needs.",
    showcase: "pdp",
  },
  {
    title: "Website hero section animation",
    text: "Scroll-ready 3D animation ready to integrate into your homepage.",
    showcase: null,
  },
] as const;

export type ShowcaseService = (typeof services)[0] | (typeof services)[1];