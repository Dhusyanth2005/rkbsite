"use client";

import { useEffect, createContext, useContext, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateGSAP = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGSAP);
    gsap.ticker.lagSmoothing(0);

    // Handle initial hash navigation on page mount (e.g. coming from /services to /#legacy)
    if (typeof window !== "undefined" && window.location.hash) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      const hash = window.location.hash;
      const scrollToHash = () => {
        const el = document.querySelector(hash);
        if (el) {
          ScrollTrigger.refresh();
          lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.0 });
        }
      };

      setTimeout(scrollToHash, 150);
      setTimeout(scrollToHash, 500);
    }

    // Handle smooth anchor clicks site-wide
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href === "/" && window.location.pathname === "/") {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }

      const isRootHash = href.startsWith("/#");
      const isPlainHash = href.startsWith("#");

      if (isPlainHash || (isRootHash && window.location.pathname === "/")) {
        const hash = isRootHash ? href.replace(/^\//, "") : href;
        if (hash === "#" || hash === "#top") {
          e.preventDefault();
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          const el = document.querySelector(hash);
          if (el) {
            e.preventDefault();
            ScrollTrigger.refresh();
            lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.2 });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(updateGSAP);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
