import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = title.getBoundingClientRect();
    const animation = title.animate([
      { transform: `translate(${selection.origin.left - target.left}px, ${selection.origin.top - target.top}px) scale(${22 / Number.parseFloat(getComputedStyle(title).fontSize)})` },
      { transform: "translate(0, 0) scale(1)" },
    ], { duration: 550, easing: "cubic-bezier(0.65, 0, 0.35, 1)" });
    return () => animation.cancel();
  }, [selection]);

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="showcase-backdrop" />
        <Dialog.Content className="service-showcase" aria-describedby={undefined}
          onCloseAutoFocus={(event) => { event.preventDefault(); selection.trigger.focus({ preventScroll: true }); }}>
          <div className="showcase-header">
            <Button variant="ghost" className="showcase-brand" onClick={onLogo} aria-label="Back to the Horizoncraft Studio logo">
              <img src={studioMark.url} alt="" />
              <span>Horizoncraft Studio</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Back to services" title="Back to services">
              <ArrowLeft />
            </Button>
          </div>
          <div className="showcase-body">
            <Dialog.Title ref={titleRef} className="showcase-title">{selection.service.title}</Dialog.Title>
            <div className="showcase-media">
              {selection.service.showcase === "film" ? (
                <div className="showcase-films">
                  <figure>
                    <iframe src="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ" title="Temporary film sample — Big Buck Bunny" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    <figcaption>Big Buck Bunny <span>Temporary film sample</span></figcaption>
                  </figure>
                  <figure>
                    <iframe src="https://www.youtube-nocookie.com/embed/R6MlUcmOul8" title="Temporary film sample — Tears of Steel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    <figcaption>Tears of Steel <span>Temporary film sample</span></figcaption>
                  </figure>
                </div>
              ) : (
                <div className="showcase-images">
                  <figure>
                    <img src={productImage} alt="Silver headphones with green fabric cushions, complete product view" width={1440} height={1024} loading="lazy" />
                    <figcaption>Product view <span>Temporary image sample</span></figcaption>
                  </figure>
                  <figure>
                    <img src={detailImage} alt="Close-up of brushed aluminum earcup and green fabric cushion" width={1440} height={1024} loading="lazy" />
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