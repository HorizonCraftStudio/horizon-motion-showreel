import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ServiceShowcase, type ServiceSelection } from "@/components/service-showcase";
import { services } from "@/lib/services";

import { apolnusLogo } from "@/lib/media";
import { braveLogo } from "@/lib/media";
import { keiretsuLogo } from "@/lib/media";
import { kreoLogo } from "@/lib/media";
import { mortCoLogo } from "@/lib/media";
import { qalzyLogo } from "@/lib/media";
import { studioMark } from "@/lib/media";
import { studioReel } from "@/lib/media";
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

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothStep = (value: number) => value * value * (3 - 2 * value);

const placeBrand = (brand: HTMLDivElement, eased: number) => {
  const isCompact = window.matchMedia("(max-width: 640px)").matches;
  const startWidth = Math.min(window.innerWidth * (isCompact ? 0.86 : 0.78), 760);
  const endWidth = Math.min(isCompact ? 248 : 274, window.innerWidth - 36);
  const mix = (from: number, to: number) => from + (to - from) * eased;

  brand.style.width = `${mix(startWidth, endWidth)}px`;
  brand.style.setProperty("--brand-size", `${mix(isCompact ? 26 : 48, 19)}px`);
  brand.style.left = `${mix(window.innerWidth / 2, isCompact ? 18 : 36)}px`;
  brand.style.top = `${mix(window.innerHeight / 2, isCompact ? 18 : 28)}px`;
  brand.style.transform = `translate(${mix(-50, 0)}%, ${mix(-50, 0)}%)`;
};

function Index() {
  const [selection, setSelection] = useState<ServiceSelection | null>(null);
  const sequenceRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const [reelOn, setReelOn] = useState(false);
  const [reelReady, setReelReady] = useState(false);
  const nextRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLElement>(null);

  const returnToLogo = (origin?: DOMRect) => {
    const page = pageRef.current;
    const brand = brandRef.current;
    if (!page || !brand || page.classList.contains("is-returning")) return;
    if (window.scrollY < 4 && !origin) return;
    if (origin) {
      // Hand off the visible modal logo to the shared animated logo without a jump.
      brand.style.width = `${origin.width}px`;
      brand.style.left = `${origin.left}px`;
      brand.style.top = `${origin.top}px`;
      brand.style.transform = "translate(0, 0)";
      brand.style.setProperty("--brand-size", "19px");
      void brand.offsetWidth;
    }
    // Logo starts growing immediately, in parallel with the page fading out
    page.classList.add("is-returning");
    placeBrand(brand, 0);
    // Jump to the top only once the logo has landed and the page is invisible
    window.setTimeout(() => {
      // Clear the reel's lingering opacity transitions while it is hidden.
      page.classList.add("is-resetting");
      sequenceRef.current?.style.setProperty("--reveal", "0");
      headerRef.current?.style.setProperty("--reveal", "0");
      headerRef.current?.style.setProperty("--pin", "0");
      setSelection(null);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, 560);
    window.setTimeout(() => page.classList.remove("is-returning", "is-resetting"), 760);
  };

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
    const header = headerRef.current;
    if (!sequence || !brand || !header) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let reelActivated = false;

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

      if (!pageRef.current?.classList.contains("is-returning")) {
        placeBrand(brand, eased);
      }
      sequence.style.setProperty("--reveal", String(eased));

      // Pin header over the white sections once the showreel scrolls away
      const sequenceBottom = sequence.getBoundingClientRect().bottom;
      const pin = clamp((110 - sequenceBottom) / 110);
      header.style.setProperty("--pin", String(pin));
      header.style.setProperty("--reveal", String(eased * (1 - pin)));

      // Mount the YouTube embed only once the reel starts revealing;
      // its autoplay then begins playback on its own.
      if (eased > 0.4 && !reelActivated) {
        reelActivated = true;
        setReelOn(true);
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
    };
  }, []);

  return (
    <main className={`studio-page${selection ? " has-service" : ""}`} ref={pageRef}>
      <header className="studio-header" ref={headerRef}>
        <div
          className="brand-lockup"
          ref={brandRef}
          role="button"
          tabIndex={0}
          aria-label="Back to the Horizoncraft Studio logo"
          onClick={() => returnToLogo()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              returnToLogo();
            }
          }}
        >
          <img className="brand-mark" src={studioMark.url} alt="" />
          <span className="brand-name">Horizoncraft Studio</span>
        </div>
      </header>
      <section className="studio-sequence" ref={sequenceRef} aria-label="Horizoncraft Studio">
        <div className="studio-stage">
          <div className="studio-reel" role="img" aria-label="Horizoncraft Studio 3D motion design showreel">
            {reelOn && (
              <iframe
                className={reelReady ? "is-ready" : undefined}
                src={studioReel.url}
                title="Horizoncraft Studio showreel"
                allow="autoplay; encrypted-media; picture-in-picture"
                tabIndex={-1}
                onLoad={() => {
                  // Reveal only after YouTube's brief start-up chrome has faded.
                  window.setTimeout(() => setReelReady(true), 2200);
                }}
              />
            )}
          </div>
          <div className="reel-shade" aria-hidden="true" />


          <div className="reel-caption">
            <span className="caption-index">Independent studio</span>
            <p>
              Horizoncraft Studio is dedicated to bringing new innovations infront of people through high quality 3D production and creative direction.
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
                  <h3>
                    {service.showcase ? (
                      <Button variant="link" className="service-name-button" onClick={(event) => {
                        setSelection({ service, origin: event.currentTarget.getBoundingClientRect(), trigger: event.currentTarget });
                      }}>{service.title}</Button>
                    ) : service.title}
                  </h3>
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
      {selection && <ServiceShowcase selection={selection} onClose={() => setSelection(null)} onLogo={returnToLogo} />}
    </main>
  );
}
