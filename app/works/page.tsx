"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTASection from "@/components/CTASection";
import { siteApi, WorkItem } from "@/services/api";
import "./workstyle.css";

/* -------------------------------------------------------------------------- */
/*  Data & Types                                                              */
/* -------------------------------------------------------------------------- */

type WorkType = "New Construction" | "Remodeling" | "Renovation";

interface DisplayPhoto {
  label: string;
  url: string;
}

interface DisplayWork {
  id: string;
  title: string;
  type: WorkType;
  year: number;
  locality: string;
  district: string;
  description: string;
  photos: DisplayPhoto[];
}

const WORK_TYPES: WorkType[] = ["New Construction", "Remodeling", "Renovation"];

function sheetNumberFor(idx: number, total: number) {
  return `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function WorksPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<WorkType | "All">("All");
  const [worksList, setWorksList] = useState<DisplayWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteApi
      .getWorks()
      .then((apiWorks) => {
        const published = apiWorks.filter((w) => w.published !== false);
        const mapped: DisplayWork[] = published.map((w, index) => {
          const photos: DisplayPhoto[] = [];

          if (w.thumbnail?.url) {
            photos.push({
              label: "Thumbnail",
              url: w.thumbnail.url,
            });
          }

          if (w.photos && w.photos.length > 0) {
            w.photos.forEach((p, pIdx) => {
              if (p.url && p.url !== w.thumbnail?.url) {
                photos.push({
                  label: p.label || p.alt || `Photo ${pIdx + 1}`,
                  url: p.url,
                });
              }
            });
          }

          return {
            id: w.id || `work-${index}`,
            title: w.title,
            type: w.type || "New Construction",
            year: w.year || new Date().getFullYear(),
            locality: w.locality || "",
            district: w.district || "",
            description: w.description || "",
            photos,
          };
        });

        setWorksList(mapped);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
  }, [worksList]);

  useEffect(() => {
    // Layout shifts when a sheet is hidden/shown — refresh trigger positions.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [filter]);

  return (
    <div ref={containerRef}>
      <WorksHero total={worksList.length} />

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

          {loading ? (
            <div style={{ padding: "4rem 0", textAlign: "center", color: "var(--dim-sub, #888)" }}>
              Loading works from archive…
            </div>
          ) : worksList.length === 0 ? (
            <div style={{ padding: "4rem 0", textAlign: "center", color: "var(--dim-sub, #888)" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No projects published yet.</p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Add and publish projects from the admin panel to display them here.
              </p>
            </div>
          ) : (
            <div className="works-sheets">
              {worksList.map((work, i) => (
                <WorkSheet
                  key={work.id || `${work.title}-${i}`}
                  work={work}
                  sheetNumber={sheetNumberFor(i, worksList.length)}
                  reversed={i % 2 === 1}
                  hidden={filter !== "All" && filter !== work.type}
                />
              ))}
            </div>
          )}
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
  sheetNumber,
  reversed,
  hidden,
}: {
  work: DisplayWork;
  sheetNumber: string;
  reversed: boolean;
  hidden: boolean;
}) {
  const [active, setActive] = useState(0);
  const photos = work.photos || [];

  return (
    <article
      className={`work-sheet${reversed ? " reversed" : ""}${hidden ? " is-filtered-out" : ""}`}
      aria-hidden={hidden}
    >
      <div className="work-sheet-gallery">
        <div className="gallery-main dim-frame">
          <span className="gallery-sheet-tag">Sheet {sheetNumber}</span>
          {photos.length > 0 && photos[active] ? (
            <>
              <img
                key={`${photos[active].url}-${active}`}
                src={photos[active].url}
                alt={`${work.title} — ${photos[active].label}`}
                className="gallery-fade-in"
              />
              <span className="gallery-caption">
                {photos[active].label} · {String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
              </span>
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(16, 112, 104, 0.05)",
                color: "var(--dim-sub, #888)",
                fontSize: "0.9rem",
              }}
            >
              No photo available
            </div>
          )}
        </div>

        {photos.length > 1 && (
          <div className="gallery-thumbs">
            {photos.map((item, i) => (
              <button
                key={`${item.url}-${i}`}
                type="button"
                className={`gallery-thumb${i === active ? " active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Show ${item.label} photo of ${work.title}`}
                aria-pressed={i === active}
              >
                <img src={item.url} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="work-sheet-info">
        <p className="dim-eyebrow work-type-eyebrow">{work.type}</p>
        <h3 className="work-sheet-title">{work.title}</h3>
        <p className="work-sheet-desc">{work.description}</p>

        <div className="titleblock">
          <div className="titleblock-row">
            <span className="titleblock-label">Location</span>
            <span className="titleblock-value">
              {[work.locality, work.district].filter(Boolean).join(", ") || "Tamil Nadu"}
            </span>
          </div>
          <div className="titleblock-row">
            <span className="titleblock-label">Year</span>
            <span className="titleblock-value">{work.year}</span>
          </div>
          <div className="titleblock-row">
            <span className="titleblock-label">Sheet</span>
            <span className="titleblock-value">{sheetNumber}</span>
          </div>
        </div>
      </div>
    </article>
  );
}