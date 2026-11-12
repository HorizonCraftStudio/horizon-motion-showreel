import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import apolnusLogo from "@/assets/apolnus-logo.png.asset.json";
import braveLogo from "@/assets/brave-logo.png.asset.json";
import keiretsuLogo from "@/assets/keiretsu-forum-logo.png.asset.json";
import kreoLogo from "@/assets/kreo-logo.png.asset.json";
import mortCoLogo from "@/assets/mort-co-logo.png.asset.json";
import qalzyLogo from "@/assets/qalzy-logo.png.asset.json";
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

const clients = [
  { name: "Apolnus", logo: apolnusLogo, height: "62px" },
  { name: "Brave", logo: braveLogo, height: "46px" },
  { name: "Kreo", logo: kreoLogo, height: "38px" },
  { name: "Keiretsu Forum", logo: keiretsuLogo, height: "72px" },
  { name: "Mort & Co", logo: mortCoLogo, height: "28px" },
  { name: "Qalzy", logo: qalzyLogo, height: "38px" },
];

const services = [
  {
    title: "Product launch film",
    text: "Cinematic 3D films that introduce your product to the world.",
  },
  {
    title: "Product PDP",
    text: "Every render, loop and detail view your product page needs.",
  },
  {
    title: "Website hero section animation",
    text: "Scroll-ready 3D animation ready to integrate into your homepage.",
  },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothStep = (value: number) => value * value * (3 - 2 * value);

function Index() {
  const sequenceRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLVideoElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

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
    const header = headerRef.current;
    if (!sequence || !brand || !reel || !header) return;

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

      // Pin header over the white sections once the showreel scrolls away
      const sequenceBottom = sequence.getBoundingClientRect().bottom;
      const pin = clamp((110 - sequenceBottom) / 110);
      header.style.setProperty("--pin", String(pin));
      header.style.setProperty("--reveal", String(eased * (1 - pin)));

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
      <header className="studio-header" ref={headerRef}>
        <div className="brand-lockup" ref={brandRef}>
          <img className="brand-mark" src={studioMark.url} alt="" />
          <span className="brand-name">Horizoncraft Studio</span>
        </div>
      </header>
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
        <section className="after-showreel fade-in" aria-label="Clients, services and contact">
          <div className="clients">
            <span className="section-label">Trusted by</span>
            <div className="logo-marquee">
              <div className="logo-track">
                {[...clients, ...clients].map((client, i) => (
                  <span
                    className="client-logo"
                    key={i}
                    aria-hidden={i >= clients.length}
                  >
                    <img
                      className="client-mark"
                      src={client.logo.url}
                      alt={client.name}
                      style={{ "--logo-h": client.height } as React.CSSProperties}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="services" aria-labelledby="services-title">
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
          </div>

          <div className="contact" aria-labelledby="contact-title">
            <span className="section-label">Contact</span>
            <h2 id="contact-title">Let's make something great.</h2>
            <div className="contact-links">
              <a href="mailto:admin@horizoncraft.studio">admin@horizoncraft.studio</a>
              <a href="tel:+917406387579">+91 7406387579</a>
            </div>
          </div>
        </section>
      </div>

      <footer className="studio-footer">
        <span>Horizoncraft Studio</span>
        <span>3D motion design agency</span>
      </footer>
    </main>
  );
}
