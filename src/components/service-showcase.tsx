import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import studioMark from "@/assets/horizoncraft-mark.png.asset.json";
import productImage from "@/assets/pdp-headphones.jpg";
import detailImage from "@/assets/pdp-headphones-detail.jpg";
import type { ShowcaseService } from "@/lib/services";

export type ServiceSelection = { service: ShowcaseService; origin: DOMRect; trigger: HTMLButtonElement };

export function ServiceShowcase({ selection, onClose, onLogo }: {
  selection: ServiceSelection;
  onClose: () => void;
  onLogo: () => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [closing, setClosing] = useState(false);
  const [readyMedia, setReadyMedia] = useState<Partial<Record<"film1" | "film2" | "image1" | "image2", boolean>>>({});
  const animationRef = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
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
    ], { duration: closing ? 420 : 1150, easing: closing ? "cubic-bezier(0.22, 1, 0.36, 1)" : "cubic-bezier(0.45, 0, 0.2, 1)", fill: "both" });
    animationRef.current = animation;
    if (closing) animation.onfinish = onClose;
    return () => { animation.onfinish = null; animation.cancel(); };
  }, [selection, closing, onClose]);

  const close = () => setClosing(true);

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) close(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="showcase-backdrop" data-closing={closing} />
        <Dialog.Content className="service-showcase" data-closing={closing} aria-describedby={undefined}
          onEscapeKeyDown={(event) => { event.preventDefault(); close(); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); selection.trigger.focus({ preventScroll: true }); }}>
          <div className="showcase-header">
            <Button variant="ghost" className="showcase-brand" onClick={onLogo} aria-label="Back to the Horizoncraft Studio logo">
              <img src={studioMark.url} alt="" />
              <span>Horizoncraft Studio</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={close} aria-label="Back to services" title="Back to services">
              <ArrowLeft />
            </Button>
          </div>
          <div className="showcase-body">
            <Dialog.Title ref={titleRef} className="showcase-title">{selection.service.title}</Dialog.Title>
            <div className="showcase-media">
              {selection.service.showcase === "film" ? (
                <div className="showcase-films">
                  <figure data-ready={Boolean(readyMedia.film1)}>
                    <iframe onLoad={() => setReadyMedia((ready) => ({ ...ready, film1: true }))} src="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ" title="Temporary film sample — Big Buck Bunny" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    <figcaption>Big Buck Bunny <span>Temporary film sample</span></figcaption>
                  </figure>
                  <figure data-ready={Boolean(readyMedia.film2)}>
                    <iframe onLoad={() => setReadyMedia((ready) => ({ ...ready, film2: true }))} src="https://www.youtube-nocookie.com/embed/R6MlUcmOul8" title="Temporary film sample — Tears of Steel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    <figcaption>Tears of Steel <span>Temporary film sample</span></figcaption>
                  </figure>
                </div>
              ) : (
                <div className="showcase-images">
                  <figure data-ready={Boolean(readyMedia.image1)}>
                    <img onLoad={() => setReadyMedia((ready) => ({ ...ready, image1: true }))} src={productImage} alt="Silver headphones with green fabric cushions, complete product view" width={1440} height={1024} loading="lazy" />
                    <figcaption>Product view <span>Temporary image sample</span></figcaption>
                  </figure>
                  <figure data-ready={Boolean(readyMedia.image2)}>
                    <img onLoad={() => setReadyMedia((ready) => ({ ...ready, image2: true }))} src={detailImage} alt="Close-up of brushed aluminum earcup and green fabric cushion" width={1440} height={1024} loading="lazy" />
                    <figcaption>Material detail <span>Temporary image sample</span></figcaption>
                  </figure>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}