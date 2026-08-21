"use client";

import { useEffect, createContext, useContext, ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis once
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

    lenisRef.current = lenis;

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateGSAP = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGSAP);
    gsap.ticker.lagSmoothing(0);

    // Global anchor click listener
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
          const el = document.querySelector(hash) as HTMLElement | null;
          if (el) {
            e.preventDefault();
            ScrollTrigger.refresh();
            const top = el.getBoundingClientRect().top + window.scrollY - 70;
            lenis.scrollTo(top, { duration: 1.2 });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(updateGSAP);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Listen to loader state to completely stop Lenis virtual scroll while loading
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLoaderState = (e: Event) => {
      const customEvent = e as CustomEvent<{ loading: boolean }>;
      const isLoading = customEvent.detail?.loading;

      if (!lenisRef.current) return;

      if (isLoading) {
        lenisRef.current.stop();
        // Keep window at top while loading unless on specific hash
        if (!window.location.hash) {
          lenisRef.current.scrollTo(0, { immediate: true });
          window.scrollTo(0, 0);
        }
      } else {
        lenisRef.current.start();
        ScrollTrigger.refresh();

        // If landing on a hash section, scroll to it smoothly now that page is ready
        if (window.location.hash) {
          const el = document.querySelector(window.location.hash) as HTMLElement | null;
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 70;
            lenisRef.current.scrollTo(top, { duration: 1.2 });
          }
        }
      }
    };

    window.addEventListener("rkb:loader-state", handleLoaderState);
    return () => {
      window.removeEventListener("rkb:loader-state", handleLoaderState);
    };
  }, []);

  return <>{children}</>;
}
