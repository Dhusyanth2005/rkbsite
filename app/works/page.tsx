"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTASection from "@/components/CTASection";
import "./workstyle.css";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type WorkType = "New Construction" | "Remodeling" | "Renovation";

interface Work {
  id: string;
  title: string;
  type: WorkType;
  year: number;
  locality: string;
  district: string;
  description: string;
  seed: string;
}

const PHOTO_LABELS = ["Exterior", "Living Area", "Facade Detail", "Interior", "Evening View"];

const WORKS: Work[] = [
  {
    id: "thevar-residence",
    title: "Thevar Residence",
    type: "New Construction",
    year: 2019,
    locality: "Saravanampatti",
    district: "Coimbatore",
    description:
      "A complete ground-up three-bedroom home planned around a shaded central courtyard, built for a family who wanted natural light in every room without losing privacy from the street. The first floor was structurally engineered for future expansion.",
    seed: "rkb-work-1",
  },
  {
    id: "kaveri-residence",
    title: "Kaveri Residence",
    type: "Renovation",
    year: 2021,
    locality: "Perundurai",
    district: "Erode",
    description:
      "Comprehensive structural restoration and weatherproofing of an aging family home, repairing foundation wear, upgrading plumbing and electrical networks, and renewing all exterior surface finishes.",
    seed: "rkb-work-2",
  },
  {
    id: "priyan-home-remodel",
    title: "Priyan Home Remodel",
    type: "Remodeling",
    year: 2022,
    locality: "Fairlands",
    district: "Salem",
    description:
      "Full interior transformation and layout reconfiguration, creating open-concept living and dining spaces, a custom modern modular kitchen, and upgraded floor plans tailored for contemporary living.",
    seed: "rkb-work-3",
  },
  {
    id: "bala-family-villa",
    title: "Bala Family Villa",
    type: "New Construction",
    year: 2018,
    locality: "Anna Nagar",
    district: "Madurai",
    description:
      "A turnkey two-storey residential build on a corner plot, built from foundation excavation to final painting with stepped terraces and integrated natural ventilation.",
    seed: "rkb-work-4",
  },
  {
    id: "kaliyaperumal-estate",
    title: "Kaliyaperumal Estate",
    type: "Renovation",
    year: 2023,
    locality: "Vadavalli",
    district: "Coimbatore",
    description:
      "Full-scale structural restoration of an older estate build, replacing degraded roof framing, reinforcing load-bearing masonry, and applying durable waterproofing systems throughout.",
    seed: "rkb-work-5",
  },
  {
    id: "mani-residence-remodel",
    title: "Mani Residence Remodel",
    type: "Remodeling",
    year: 2020,
    locality: "Avinashi Road",
    district: "Tiruppur",
    description:
      "Complete interior redesign and structural room addition, converting unused patio areas into an expanded master suite and modernizing all bathroom suites and finishes.",
    seed: "rkb-work-6",
  },
];

const WORK_TYPES: WorkType[] = ["New Construction", "Remodeling", "Renovation"];

function sheetNumberFor(work: Work) {
  const idx = WORKS.findIndex((w) => w.id === work.id) + 1;
  return `${String(idx).padStart(2, "0")} / ${String(WORKS.length).padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function WorksPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<WorkType | "All">("All");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".works-hero-eyebrow", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".works-hero-title", { y: 40, opacity: 0, duration: 1 }, 0.1)
        .from(".works-hero-sub", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".works-hero-count", { opacity: 0, duration: 0.8 }, "-=0.5");

      gsap.from(".filter-chip", {
        y: 14,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.utils.toArray<HTMLElement>(".work-sheet").forEach((sheet) => {
        gsap.from(sheet, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sheet,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Layout shifts when a sheet is hidden/shown — refresh trigger positions.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [filter]);

  return (
    <div ref={containerRef}>
      <WorksHero total={WORKS.length} />

      <section className="section-pad works-list-section">
        <div className="container">
          <div className="works-filter-bar" role="group" aria-label="Filter works by type">
            <button
              type="button"
              className={`filter-chip${filter === "All" ? " active" : ""}`}
              onClick={() => setFilter("All")}
            >
              All Works
            </button>
            {WORK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`filter-chip${filter === type ? " active" : ""}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="works-sheets">
            {WORKS.map((work, i) => (
              <WorkSheet
                key={work.id}
                work={work}
                reversed={i % 2 === 1}
                hidden={filter !== "All" && filter !== work.type}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Have land, and a home in mind?"
        description="Every project on this page started as a plot and a conversation. Yours can too."
        className="works-cta"
      />
    </div>
  );
}

/* --------------------------------- Hero --------------------------------- */

function WorksHero({ total }: { total: number }) {
  return (
    <section className="works-hero">
      <div className="works-hero-grid blueprint-grid" aria-hidden="true" />
      <div className="container works-hero-content">
        <p className="dim-eyebrow works-hero-eyebrow">R K B Builders · Our Works</p>
        <h1 className="works-hero-title">Every project, on record.</h1>
        <p className="works-hero-sub">
          A working archive of what we&apos;ve built across Tamil Nadu — houses, apartments, villas
          and commercial spaces, each one planned, built and handed over by our own team.
        </p>
        <p className="works-hero-count">
          {String(total).padStart(2, "0")} projects catalogued
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- Work Sheet ------------------------------- */

function WorkSheet({
  work,
  reversed,
  hidden,
}: {
  work: Work;
  reversed: boolean;
  hidden: boolean;
}) {
  const [active, setActive] = useState(0);
  const images = PHOTO_LABELS.map(
    (_, i) => `https://picsum.photos/seed/${work.seed}-${i + 1}/1200/900`
  );

  return (
    <article
      className={`work-sheet${reversed ? " reversed" : ""}${hidden ? " is-filtered-out" : ""}`}
      aria-hidden={hidden}
    >
      <div className="work-sheet-gallery">
        <div className="gallery-main dim-frame">
          <span className="gallery-sheet-tag">Sheet {sheetNumberFor(work)}</span>
          <img
            key={active}
            src={images[active]}
            alt={`${work.title} — ${PHOTO_LABELS[active]}`}
            className="gallery-fade-in"
          />
          <span className="gallery-caption">
            {PHOTO_LABELS[active]} · {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </div>

        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`gallery-thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Show ${PHOTO_LABELS[i]} photo of ${work.title}`}
              aria-pressed={i === active}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="work-sheet-info">
        <p className="dim-eyebrow work-type-eyebrow">{work.type}</p>
        <h3 className="work-sheet-title">{work.title}</h3>
        <p className="work-sheet-desc">{work.description}</p>

        <div className="titleblock">
          <div className="titleblock-row">
            <span className="titleblock-label">Location</span>
            <span className="titleblock-value">
              {work.locality}, {work.district}
            </span>
          </div>
          <div className="titleblock-row">
            <span className="titleblock-label">Year</span>
            <span className="titleblock-value">{work.year}</span>
          </div>
          <div className="titleblock-row">
            <span className="titleblock-label">Sheet</span>
            <span className="titleblock-value">{sheetNumberFor(work)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}