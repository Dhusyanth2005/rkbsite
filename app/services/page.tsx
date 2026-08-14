"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTASection from "@/components/CTASection";
import "./servicestyle.css";

/* ==========================================================================
   R K B BUILDERS — Services Page

   Signature devices, both extensions of the homepage's blueprint motif:

   1. The Delivery Gallery — the three ways we build (New Construction,
      Remodeling, Renovation) sit side by side like elevation drawings
      pinned to a board: quiet and grayscale until one is brought into
      focus. Sits above the scope of work, framing what follows.

   2. The Spec Timeline — the ten trades read like line items on a
      construction drawing's specification sheet (S-01 … S-10), laid out
      as independent cards along a dimension-line spine, the same motif
      used on the homepage generational timeline. Every card is open by
      default — nothing to click, nothing hidden.
   ========================================================================== */

/* -------------------------------------------------------------------------- */
/*  Icons — same stroke language as the homepage Why Us icons                */
/* -------------------------------------------------------------------------- */

function IconFoundation() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 20V9M12 20V9M18 20V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3.5 9L12 4l8.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMasonry() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="4.5" width="7" height="4.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="4.5" width="7" height="4.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="17.5" y="4.5" width="3" height="4.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="0.5" y="4.5" width="3" height="4.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="9" width="7" height="4.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="9" width="6.5" height="4.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="0.5" y="9" width="6.5" height="4.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3.5" y="13.5" width="7" height="4.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="13.5" width="7" height="4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPlumbing() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 4v6a4 4 0 0 0 4 4h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18 4v6a4 4 0 0 1-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.5 4h3M16.5 4h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M11 14c0 3.5 2.2 3.7 2.2 6.1a2.2 2.2 0 1 1-4.4 0c0-2.4 2.2-2.6 2.2-6.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconElectrical() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12.5 3 5 13.5h5.5L10 21l7.5-10.5H12l0.5-7.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconDoorsWindows() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="7" height="17" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.8 12v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.5 7h7M17 3.5v7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconFlooring() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconPlastering() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="16" height="6" x="2" y="2" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect width="4" height="6" x="8" y="16" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconBathroom() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 12V6a2.5 2.5 0 0 1 4.7-1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 21.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconKitchen() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M2 12h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 8 16-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconExterior() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 15v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const SERVICES = [
  {
    code: "S-01",
    title: "Foundation & Structural Construction",
    desc: "Building the foundation, columns, beams, slabs, walls, and other structural elements.",
    icon: <IconFoundation />,
  },
  {
    code: "S-02",
    title: "Masonry & Brickwork",
    desc: "Construction of walls and other masonry work according to the planned design.",
    icon: <IconMasonry />,
  },
  {
    code: "S-03",
    title: "Plumbing & Water Systems",
    desc: "Complete plumbing work, including water supply lines, drainage, sanitary connections, and other essential plumbing requirements.",
    icon: <IconPlumbing />,
  },
  {
    code: "S-04",
    title: "Electrical Work",
    desc: "Electrical wiring, switch points, lighting points, power connections, and other essential electrical requirements for the home.",
    icon: <IconElectrical />,
  },
  {
    code: "S-05",
    title: "Doors & Windows",
    desc: "Installation of doors, windows, frames, and related fittings.",
    icon: <IconDoorsWindows />,
  },
  {
    code: "S-06",
    title: "Flooring & Tiling",
    desc: "Flooring, wall tiling, bathroom tiling, and other tile-related work.",
    icon: <IconFlooring />,
  },
  {
    code: "S-07",
    title: "Plastering & Painting",
    desc: "Interior and exterior plastering, surface preparation, painting, and finishing.",
    icon: <IconPlastering />,
  },
  {
    code: "S-08",
    title: "Bathroom & Sanitary Work",
    desc: "Bathroom construction, sanitary fittings, and related installations.",
    icon: <IconBathroom />,
  },
  {
    code: "S-09",
    title: "Kitchen Requirements",
    desc: "Essential construction and utility provisions for kitchen spaces.",
    icon: <IconKitchen />,
  },
  {
    code: "S-10",
    title: "Exterior & Finishing Work",
    desc: "Final exterior work and finishing details required to complete the home.",
    icon: <IconExterior />,
  },
];

const SERVICE_TYPES = [
  {
    image: "https://picsum.photos/seed/rkb-new-construction/1000/1300",
    label: "New Construction",
    desc: "Ground-up builds engineered and executed from the first foundation line to final handover.",
  },
  {
    image: "https://picsum.photos/seed/rkb-remodeling/1000/1300",
    label: "Remodeling",
    desc: "Reshaping existing spaces — structural changes, layout shifts, and full interior transformation.",
  },
  {
    image: "https://picsum.photos/seed/rkb-renovation/1000/1300",
    label: "Renovation",
    desc: "Restoring and upgrading older builds with modern systems, finishes, and lasting durability.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ServicesPage() {
  return (
    <>
      <ServiceHero />
      <ServiceTypeGallery />
      <ServiceIntro />
      <SpecSheet />
      <CTASection
        title="Have a project in mind?"
        description="Call us today and let's scope your build, trade by trade."
      />
    </>
  );
}

/* --------------------------------- Hero --------------------------------- */

function ServiceHero() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".svc-hero-eyebrow", { y: -20, opacity: 0, duration: 0.8 })
        .from(".svc-hero-title", { y: 35, opacity: 0, duration: 0.9 }, "-=0.5")
        .from(".svc-hero-sub", { y: 20, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(".svc-hero-tags span", { y: 14, opacity: 0, stagger: 0.08, duration: 0.6 }, "-=0.4");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="svc-hero" ref={ref}>
      <div className="svc-hero-bg blueprint-grid" aria-hidden="true" />
      <div className="container">
        <p className="dim-eyebrow svc-hero-eyebrow">R K B Builders · Services</p>
        <h1 className="svc-hero-title">Residential Construction Services</h1>
        <p className="svc-hero-sub">
          We specialize in new construction, remodeling, and renovations — every trade carried out
          in-house, start to finish.
        </p>
        <div className="svc-hero-tags">
          <span>New Construction</span>
          <span>Remodeling</span>
          <span>Renovation</span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Intro -------------------------------- */

function ServiceIntro() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".svc-intro-content > *", {
        y: 25,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="svc-intro section-pad" ref={ref}>
      <div className="container svc-intro-content">
        <p className="dim-eyebrow">What We Build</p>
        <h2 className="svc-intro-title">Complete Construction Services</h2>
        <p className="svc-intro-text">
          Our new construction work includes the essential requirements of a complete home. Every
          trade below is carried out by our own teams — no subcontracted guesswork, one point of
          responsibility from the first column to the last coat of paint.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Delivery Gallery ---------------------------- */
/* New construction / remodeling / renovation shown as elevation panels
   pinned side by side; grayscale and quiet until one is brought into
   focus. Sits above the spec sheet, framing the trades that follow. */

function ServiceTypeGallery() {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".svc-gallery-header > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".svc-gallery-header",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".svc-gallery-panel", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".svc-gallery-track",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="svc-gallery section-pad" ref={ref}>
      <div className="container">
        <div className="svc-gallery-header">
          <p className="dim-eyebrow">How We Deliver</p>
          <h2 className="svc-gallery-title">Every build, a different starting point.</h2>
        </div>

        <div className="svc-gallery-track" role="list">
          {SERVICE_TYPES.map((item, i) => {
            const isActive = active === i;
            return (
              <button
                key={item.label}
                role="listitem"
                type="button"
                className={`svc-gallery-panel${isActive ? " active" : ""}`}
                style={{ flexGrow: isActive ? 5 : 1 }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-label={`${item.label} — ${item.desc}`}
              >
                <img src={item.image} alt={item.label} loading="lazy" />
                <span className="svc-gallery-overlay">
                  <span className="svc-gallery-code">{String(i + 1).padStart(2, "0")}</span>
                  <span className="svc-gallery-label">{item.label}</span>
                  <span className="svc-gallery-desc">{item.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Spec Timeline ------------------------------ */
/* Signature device — the ten trades laid out as independent, always-open
   cards along a dimension spine, echoing the homepage generational
   timeline. No accordion, no clicking required. */

function SpecSheet() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".spec-card", {
        y: 34,
        opacity: 0,
        stagger: 0.09,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".spec-timeline",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="svc-spec section-pad" ref={ref}>
      <div className="container">
        <div className="svc-spec-header">
          <p className="dim-eyebrow">Scope of Work</p>
          <h2 className="svc-spec-title">Ten trades, one contractor.</h2>
          <span className="svc-spec-count">10 / 10 IN-HOUSE</span>
        </div>

        <div className="spec-timeline">
          <div className="spec-timeline-line" aria-hidden="true" />
          {SERVICES.map((s) => (
            <div className="spec-card" key={s.code}>
              <div className="spec-card-dot" aria-hidden="true">
                <span />
              </div>
              <div className="spec-card-body">
                <span className="spec-card-number" aria-hidden="true">
                  {s.code.replace("S-", "")}
                </span>
                <span className="spec-card-code">{s.code}</span>
                <div className="spec-card-icon">{s.icon}</div>
                <h3 className="spec-card-title">{s.title}</h3>
                <p className="spec-card-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}