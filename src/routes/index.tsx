import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import studioMark from "@/assets/horizoncraft-mark.png.asset.json";
import studioReel from "@/assets/horizoncraft-showreel.mp4.asset.json";
import { introProgressFromScroll } from "@/lib/intro-scroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Horizoncraft Studio — 3D Motion Design" },
      {
        name: "description",
        content:
          "Horizoncraft Studio is an independent 3D motion design studio creating visual worlds in motion.",
      },
      { property: "og:title", content: "Horizoncraft Studio — 3D Motion Design" },
      {
        property: "og:description",
        content:
          "An independent 3D motion design studio creating visual worlds in motion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const clientLogos = ["Northwind", "Lumen", "Axiom Labs", "Vertex", "Orbitra"];

const services = [
  {
    title: "Product launch film",
    text: "Cinematic 3D films that introduce your product to the world.",
  },
  {
    title: "Complete product PDP",
    text: "Every render, loop and detail view your product page needs.",
  },
  {
    title: "Website hero section animation",
    text: "Scroll-ready 3D motion that makes your homepage unforgettable.",
  },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothStep = (value: number) => value * value * (3 - 2 * value);

function Index() {
  const sequenceRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLVideoElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nextRef.current;
    if (!node) return;
    const items = node.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sequence = sequenceRef.current;
    const brand = brandRef.current;
    const reel = reelRef.current;
    if (!sequence || !brand || !reel) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let isPlaying = false;

    const render = () => {
      frameId = 0;
      const sequenceTravel = Math.max(1, sequence.offsetHeight - window.innerHeight);
      const scrollIntoSequence = -sequence.getBoundingClientRect().top;
      const rawProgress = introProgressFromScroll(
        scrollIntoSequence,
        sequenceTravel * 0.8,
      ); // reveal finishes just before the sequence ends, no hold
      const eased = reducedMotion.matches
        ? rawProgress > 0.45
          ? 1
          : 0
        : smoothStep(rawProgress);

      const isCompact = window.matchMedia("(max-width: 640px)").matches;
      const startWidth = Math.min(window.innerWidth * (isCompact ? 0.86 : 0.78), 760);
      const endWidth = Math.min(isCompact ? 248 : 274, window.innerWidth - 36);
      const mix = (from: number, to: number) => from + (to - from) * eased;

      brand.style.width = `${mix(startWidth, endWidth)}px`;
      brand.style.setProperty(
        "--brand-size",
        `${mix(isCompact ? 26 : 48, 19)}px`,
      );
      brand.style.left = `${mix(window.innerWidth / 2, isCompact ? 18 : 36)}px`;
      brand.style.top = `${mix(window.innerHeight / 2, isCompact ? 18 : 28)}px`;
      brand.style.transform = `translate(${mix(-50, 0)}%, ${mix(-50, 0)}%)`;
      sequence.style.setProperty("--reveal", String(eased));

      if (eased > 0.4 && !isPlaying) {
        isPlaying = true;
        void reel.play().catch(() => {
          isPlaying = false;
        });
      } else if (eased <= 0.4 && isPlaying) {
        reel.pause();
        isPlaying = false;
      }
    };

    const scheduleRender = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender);
    reducedMotion.addEventListener("change", scheduleRender);

    return () => {
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleRender);
      reducedMotion.removeEventListener("change", scheduleRender);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      reel.pause();
    };
  }, []);

  return (
    <main className="studio-page">
      <section className="studio-sequence" ref={sequenceRef} aria-label="Horizoncraft Studio">
        <div className="studio-stage">
          <video
            className="studio-reel"
            ref={reelRef}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Horizoncraft Studio 3D motion design showreel"
          >
            <source src={studioReel.url} type="video/mp4" />
          </video>
          <div className="reel-shade" aria-hidden="true" />

          <header className="studio-header">
            <div className="brand-lockup" ref={brandRef}>
              <img className="brand-mark" src={studioMark.url} alt="" />
              <span className="brand-name">Horizoncraft Studio</span>
            </div>
            <span className="header-specialty">3D motion design</span>
          </header>

          <div className="reel-caption">
            <span className="caption-index">Independent studio</span>
            <p>
              Horizoncraft Studio is dedicated to bringing new innovations infront of people before they miss it.
            </p>
          </div>
          <span className="frame-count" aria-hidden="true">
            HCS — 001
          </span>
        </div>
      </section>

      <div ref={nextRef}>
        <section className="clients fade-in" aria-label="Our clients">
          <span className="section-label">Trusted by</span>
          <div className="logo-marquee">
            <div className="logo-track">
              {[...clientLogos, ...clientLogos].map((name, i) => (
                <span className="client-logo" key={i} aria-hidden={i >= clientLogos.length}>
                  <span className="client-glyph" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="services fade-in" aria-labelledby="services-title">
          <span className="section-label">Services</span>
          <h2 id="services-title">What we make</h2>
          <ol className="service-list">
            {services.map((service, i) => (
              <li key={service.title}>
                <span className="service-index">0{i + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <footer className="studio-footer">
        <span>Horizoncraft Studio</span>
        <span>3D motion design agency</span>
      </footer>
    </main>
  );
}
