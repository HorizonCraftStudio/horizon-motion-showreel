export const services = [
  {
    title: "Product launch film",
    text: "Cinematic 3D product animations and launch films that introduce new products with high-impact visual storytelling.",
    showcase: "film",
  },
  {
    title: "Product PDP",
    text: "Photorealistic 3D product renders, animated loops and close-up detail views for product detail pages.",
    showcase: "pdp",
  },
  {
    title: "Website hero section animation",
    text: "Scroll-ready 3D animation that brings product features and brand stories to life on website homepages.",
    showcase: null,
  },
] as const;

export type ShowcaseService = (typeof services)[0] | (typeof services)[1];