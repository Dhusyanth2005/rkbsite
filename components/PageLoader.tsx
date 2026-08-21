"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { siteApi } from "@/services/api";
import "./PageLoader.css";

export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [rendered, setRendered] = useState(true);
  const cycleIdRef = useRef(0);

  const startLoader = async () => {
    const currentCycle = ++cycleIdRef.current;
    setRendered(true);
    setVisible(true);

    // 1. Minimum 2000ms timer so the 3D tower animation is fully enjoyed
    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 3000));

    // 2. Allow page useEffects to mount and dispatch any initial API fetch calls
    await new Promise((resolve) => setTimeout(resolve, 80));

    // 3. Wait for BOTH the 2000ms minimum timer AND all active API calls to settle
    await Promise.all([minDelayPromise, siteApi.waitForIdle()]);

    // If another route transition started in the meantime, don't close
    if (cycleIdRef.current !== currentCycle) return;

    setVisible(false);
    setTimeout(() => {
      if (cycleIdRef.current === currentCycle) {
        setRendered(false);
      }
    }, 450); // Matches CSS transition duration
  };

  // Strict viewport freeze: lock body position and reset scroll position to top
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("rkb:loader-state", { detail: { loading: visible } }));
    }

    if (visible) {
      document.documentElement.classList.add("rkb-loading");
      document.body.classList.add("rkb-loading");
      window.scrollTo(0, 0);

      const preventDefault = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const preventKeys = (e: KeyboardEvent) => {
        if (
          ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      window.addEventListener("wheel", preventDefault, { passive: false, capture: true });
      window.addEventListener("touchmove", preventDefault, { passive: false, capture: true });
      window.addEventListener("scroll", preventDefault, { passive: false, capture: true });
      window.addEventListener("keydown", preventKeys, { passive: false, capture: true });

      return () => {
        document.documentElement.classList.remove("rkb-loading");
        document.body.classList.remove("rkb-loading");
        window.removeEventListener("wheel", preventDefault, { capture: true });
        window.removeEventListener("touchmove", preventDefault, { capture: true });
        window.removeEventListener("scroll", preventDefault, { capture: true });
        window.removeEventListener("keydown", preventKeys, { capture: true });
      };
    } else {
      document.documentElement.classList.remove("rkb-loading");
      document.body.classList.remove("rkb-loading");
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }
  }, [visible]);

  // Trigger when pathname changes (route transition)
  useEffect(() => {
    startLoader();
  }, [pathname]);

  // Catch internal navigation link clicks to start loader immediately
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      // Only internal routes that are not hash jumps on the same page
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.includes("#") &&
        href !== pathname &&
        !target.getAttribute("target") &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        setRendered(true);
        setVisible(true);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [pathname]);

  if (!rendered) return null;

  return (
    <div
      className={`page-loader-overlay${!visible ? " fade-out" : ""}`}
      aria-hidden={!visible}
      aria-label="Loading page content"
    >
      <div className="page-loader-stage">
        <div className="tower-loader">
          <div className="box box-1">
            <div className="side-left" />
            <div className="side-right" />
            <div className="side-top" />
          </div>
          <div className="box box-2">
            <div className="side-left" />
            <div className="side-right" />
            <div className="side-top" />
          </div>
          <div className="box box-3">
            <div className="side-left" />
            <div className="side-right" />
            <div className="side-top" />
          </div>
          <div className="box box-4">
            <div className="side-left" />
            <div className="side-right" />
            <div className="side-top" />
          </div>
        </div>

        <div className="page-loader-brand">
          <span className="page-loader-title">R K B BUILDERS</span>
          <span className="page-loader-subtitle">EST. 1940 · TAMIL NADU</span>
        </div>
      </div>
    </div>
  );
}
