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

    let hashTimer1: NodeJS.Timeout | null = null;
    let hashTimer2: NodeJS.Timeout | null = null;

    const handleLoaderState = (e: Event) => {
      const customEvent = e as CustomEvent<{ loading: boolean }>;
      const isLoading = customEvent.detail?.loading;

      if (!lenisRef.current) return;

      if (isLoading) {
        lenisRef.current.stop();
        if (hashTimer1) clearTimeout(hashTimer1);
        if (hashTimer2) clearTimeout(hashTimer2);
      } else {
        // Wait for .rkb-loading class to be removed and layout to expand to full height
        hashTimer1 = setTimeout(() => {
          if (!lenisRef.current) return;
          lenisRef.current.start();
          ScrollTrigger.refresh();

          const hash = window.location.hash;
          if (hash) {
            const el = document.querySelector(hash) as HTMLElement | null;
            if (el) {
              const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
              lenisRef.current.scrollTo(top, { duration: 1.2 });
            }
          }
        }, 80);

        // Follow-up adjustment once GSAP timeline pinning finishes measuring
        hashTimer2 = setTimeout(() => {
          const hash = window.location.hash;
          if (hash && lenisRef.current) {
            ScrollTrigger.refresh();
            const el = document.querySelector(hash) as HTMLElement | null;
            if (el) {
              const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
              lenisRef.current.scrollTo(top, { duration: 0.6 });
            }
          }
        }, 450);
      }
    };

    window.addEventListener("rkb:loader-state", handleLoaderState);
    return () => {
      window.removeEventListener("rkb:loader-state", handleLoaderState);
      if (hashTimer1) clearTimeout(hashTimer1);
      if (hashTimer2) clearTimeout(hashTimer2);
    };
  }, []);

  return <>{children}</>;
}
