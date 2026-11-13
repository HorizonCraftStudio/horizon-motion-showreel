import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import studioMark from "@/assets/horizoncraft-mark.png.asset.json";
import pdpCaldigitDock from "@/assets/pdp-caldigit-dock.webp.asset.json";
import pdpEarbudsDark from "@/assets/pdp-earbuds-dark.webp.asset.json";
import pdpEarbudsPixel from "@/assets/pdp-earbuds-pixel.webp.asset.json";
import pdpHyphenSerum from "@/assets/pdp-hyphen-serum.png.asset.json";
import pdpMieleWineCooler from "@/assets/pdp-miele-wine-cooler.png.asset.json";
import pdpBraveParallax from "@/assets/pdp-brave-parallax.png.asset.json";
import pdpWatchBlue from "@/assets/pdp-watch-blue.png.asset.json";
import pdpWatchOrange from "@/assets/pdp-watch-orange.png.asset.json";
import type { ShowcaseService } from "@/lib/services";

const pdpImages = [
  { asset: pdpCaldigitDock, aspect: 16 / 9, alt: "Silver CalDigit docking station with USB-C and SD card ports on a reflective surface", caption: "CalDigit dock" },
  { asset: pdpHyphenSerum, aspect: 1, alt: "Four views of the Hyphen Power Peptides Cocktail Serum bottle with a lavender cap and blue serum, styled with glass beakers, test tubes and gel cubes", caption: "Hyphen serum" },
  { asset: pdpBraveParallax, aspect: 1, alt: "Brave Parallax smart display in five views: a stylus painting app with red poppies, a height-adjustable stand profile, portrait video playback mirrored from a phone, stereo sound waves and a close-up of the port panel", caption: "Brave Parallax", tag: "3D Product PDP" },
  { asset: pdpEarbudsDark, aspect: 16 / 9, alt: "Transparent wireless earbuds floating over a dark blue surface with water droplets", caption: "Visual RnD#2", tag: "3D Product render" },
  { asset: pdpEarbudsPixel, aspect: 16 / 9, alt: "Transparent wireless earbuds dissolving into pixels on a white background", caption: "Visual RnD#1", tag: "3D Product render" },
  { asset: pdpMieleWineCooler, aspect: 1, alt: "Miele under-counter wine cooler shown from four angles with blue interior lighting and bottles on the shelves", caption: "Miele wine cooler", tag: "3D Product PDP" },
  { asset: pdpWatchOrange, aspect: 16 / 9, alt: "Smartwatch with orange strap lit by warm orange light", caption: "Samsung Galaxy Watch Ultra", tag: "3D Product render" },
  { asset: pdpWatchBlue, aspect: 16 / 9, alt: "Smartwatch with blue strap against a starry night sky with a bright lens flare", caption: "Samsung Galaxy Watch 4", tag: "3D Product render" },
];

const pdpRows = Array.from({ length: Math.ceil(pdpImages.length / 2) }, (_, row) => pdpImages.slice(row * 2, row * 2 + 2));

export type ServiceSelection = { service: ShowcaseService; origin: DOMRect; trigger: HTMLButtonElement };

export function ServiceShowcase({ selection, onClose, onLogo }: {
  selection: ServiceSelection;
  onClose: () => void;
  onLogo: (origin: DOMRect) => void;
}) {
  const [title, setTitle] = useState<HTMLHeadingElement | null>(null);
  const [closing, setClosing] = useState(false);
  const [logoReturning, setLogoReturning] = useState(false);
  const [readyMedia, setReadyMedia] = useState<Record<string, boolean>>({});
  const animationRef = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    if (!title) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (closing) onClose();
      return;
    }
    const currentTransform = getComputedStyle(title).transform;
    animationRef.current?.cancel();
    const target = title.getBoundingClientRect();
    const scale = Number.parseFloat(getComputedStyle(selection.trigger).fontSize) / Number.parseFloat(getComputedStyle(title).fontSize);
    const originTransform = `translate(${selection.origin.left - target.left}px, ${selection.origin.top - target.top}px) scale(${scale})`;
    const animation = title.animate([
      { transform: closing ? currentTransform : originTransform },
      { transform: closing ? originTransform : "translate(0, 0) scale(1)" },
    ], { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" });
    animationRef.current = animation;
    if (closing) animation.onfinish = onClose;
    return () => { animation.onfinish = null; animation.cancel(); };
  }, [title, selection, closing, onClose]);

  const close = () => setClosing(true);

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) close(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="showcase-backdrop" data-closing={closing} />
        <Dialog.Content className="service-showcase" data-closing={closing} data-logo-returning={logoReturning} aria-describedby={undefined}
          onEscapeKeyDown={(event) => { event.preventDefault(); close(); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); if (!logoReturning) selection.trigger.focus({ preventScroll: true }); }}>
          <div className="showcase-header">
            <Button variant="ghost" className="showcase-brand" onClick={(event) => {
              if (logoReturning) return;
              setLogoReturning(true);
              onLogo(event.currentTarget.getBoundingClientRect());
            }} aria-label="Back to the Horizoncraft Studio logo">
              <img src={studioMark.url} alt="" />
              <span>Horizoncraft Studio</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={close} aria-label="Back to services" title="Back to services">
              <ArrowLeft />
            </Button>
          </div>
          <div className="showcase-body">
            <Dialog.Title ref={setTitle} className="showcase-title">{selection.service.title}</Dialog.Title>
            <div className="showcase-media">
              {selection.service.showcase === "film" ? (
                <div className="showcase-films">
                  <figure data-ready={Boolean(readyMedia["film1"])}>
                    <div className="film-frame">
                      <iframe onLoad={() => setReadyMedia((ready) => ({ ...ready, film1: true }))} src="https://www.youtube-nocookie.com/embed/qYks1zCuC28" title="Product launch film sample" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                    </div>
                    <figcaption>KQi Air X <span className="film-tag">3D launch film</span></figcaption>
                  </figure>
                  <figure data-ready={Boolean(readyMedia["film2"])}>
                    <div className="film-frame">
                      <iframe onLoad={() => setReadyMedia((ready) => ({ ...ready, film2: true }))} src="https://www.youtube-nocookie.com/embed/G9aDGM9YRxU" title="Product launch film sample" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                    </div>
                    <figcaption>Kreo Arma <span className="film-tag">3D launch film</span></figcaption>
                  </figure>
                  <figure data-ready={Boolean(readyMedia["film3"])}>
                    <div className="film-frame">
                      <iframe onLoad={() => setReadyMedia((ready) => ({ ...ready, film3: true }))} src="https://www.youtube-nocookie.com/embed/Q8hsB0BFU1E" title="Product launch film sample" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                    </div>
                    <figcaption>Brave Parallax <span className="film-tag">3D launch film</span></figcaption>
                  </figure>
                </div>
              ) : (
                <div className="showcase-images">
                  {pdpRows.map((row, rowIndex) => (
                    <div className="showcase-row" key={row.map((image) => image.caption).join("|")}>
                      {row.map((image, columnIndex) => {
                        const index = rowIndex * 2 + columnIndex;
                        return (
                          <figure key={image.asset.url} style={{ flexGrow: image.aspect }} data-ready={Boolean(readyMedia[`image${index}`])}>
                            <img onLoad={() => setReadyMedia((ready) => ({ ...ready, [`image${index}`]: true }))} src={image.asset.url} alt={image.alt} loading="lazy" />
                            <figcaption>{image.caption} <span>{image.tag ?? "3D Product render"}</span></figcaption>
                          </figure>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}