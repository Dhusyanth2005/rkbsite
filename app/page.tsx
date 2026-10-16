"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTASection from "@/components/CTASection";
import { siteApi, HeroData, WorkItem } from "@/services/api";

/* -------------------------------------------------------------------------- */
/*  Utilities                                                                 */
/* -------------------------------------------------------------------------- */

function animateCountUp(elements: NodeListOf<HTMLElement> | HTMLElement[] | null | undefined) {
  if (!elements) return;
  const arr = Array.from(elements);

  arr.forEach((el) => {
    if (!el.hasAttribute("data-target")) {
      el.setAttribute("data-target", el.textContent?.trim() || "");
    }
    const targetText = el.getAttribute("data-target") || "";
    const match = targetText.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!match) return;

    const prefix = match[1] || "";
    const rawNum = parseInt(match[2].replace(/,/g, ""), 10);
    const suffix = match[3] || "";
    const isYear = rawNum >= 1900 && rawNum <= 2100 && !targetText.includes(",");

    if (isNaN(rawNum)) return;

    const obj = { value: 0 };
    gsap.to(obj, {
      value: rawNum,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        const val = Math.floor(obj.value);
        const numStr = isYear ? String(val) : val.toLocaleString("en-US");
        el.textContent = `${prefix}${numStr}${suffix}`;
      },
    });
  });
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const LEGACY = [
  {
    code: "G-01",
    name: "Mr. Rathnavel Thevar",
    role: "Founder",
    desc: "Laid the foundation of the company, active in construction long before it carried a formal name.",
  },
  {
    code: "G-02",
    name: "R. Kaliyaperumal",
    role: "Second Generation",
    desc: "Carried the founder's work forward, growing the practice across Tamil Nadu.",
  },
  {
    code: "G-03",
    name: "Mr. R. K. Bala & R. K. Mani",
    role: "MA, B.Ed · Third Generation",
    desc: "Expanded the company's reach into houses, buildings and apartment construction.",
  },
  {
    code: "G-04",
    name: "Er. R. K. B. Tamilpriyan",
    role: "ME, M.Plan · Managing Director",
    desc: "Leads R K B Builders today, continuing four generations of building experience.",
    current: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Legacy />
      <Works />
      <WhyUs />
      <Certifications />
      <CTASection />
    </>
  );
}

/* ---------------------------------- Hero ---------------------------------- */

/** Returns "dark" when the <html> element carries a dark-theme signal. */
function getActiveTheme(): "light" | "dark" {
  const html = document.documentElement;
  return html.classList.contains("dark") ||
    html.getAttribute("data-theme") === "dark" ||
    html.getAttribute("data-color-scheme") === "dark"
    ? "dark"
    : "light";
}

function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Fetch hero data
  useEffect(() => {
    siteApi.getHero().then((data) => {
      if (data && (data.video_light?.url || data.video_dark?.url || data.poster?.url)) {
        setHeroData(data);
      }
    });
  }, []);

  // Detect initial theme and watch for changes via MutationObserver
  useEffect(() => {
    setTheme(getActiveTheme());

    const observer = new MutationObserver(() => setTheme(getActiveTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-color-scheme"],
    });
    return () => observer.disconnect();
  }, []);

  // Pause video when hero is off-screen; resume when it returns
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {/* autoplay policy — silently ignore */});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, [heroData, theme]); // re-wire whenever the rendered video changes

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Intro entrance timeline on initial page load
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { y: -25, opacity: 0, duration: 0.9 })
        .from(".hero-title", { y: 45, opacity: 0, duration: 1.1 }, "-=0.6")
        .from(".hero-quote", { y: 25, opacity: 0, duration: 0.8 }, "-=0.7")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(
          ".hero-actions .btn",
          { y: 30, opacity: 0, scale: 0.94, stagger: 0.14, duration: 0.8, ease: "back.out(1.6)" },
          "-=0.5"
        )
        .from(
          ".hero-stat",
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            onStart: () => {
              animateCountUp(containerRef.current?.querySelectorAll<HTMLElement>(".hero-stat b"));
            },
          },
          "-=0.4"
        )
        .from(".scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.3");

      // Parallax scroll effect on Hero media & content
      gsap.to(".hero-media", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-content", {
        yPercent: -12,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "80% top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const videoLightSrc = heroData?.video_light?.url || "";
  const videoDarkSrc = heroData?.video_dark?.url || "";
  const posterSrc = heroData?.poster?.url || undefined;

  // Only mount the video that matches the active theme — avoids loading both streams
  const activeSrc = theme === "dark" ? videoDarkSrc : videoLightSrc;
  const activeClass = theme === "dark" ? "hero-video hero-video-dark" : "hero-video hero-video-light";

  return (
    <section className="hero" id="home" ref={containerRef}>
      <div className="hero-media">
        {activeSrc && (
          <video
            ref={videoRef}
            key={activeSrc}
            className={activeClass}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
          >
            <source src={activeSrc} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="container hero-content">
        <p className="dim-eyebrow hero-eyebrow">R K B Builders · Since 1940</p>

        <h1 className="hero-title">Do you need a new home built?</h1>
        <p className="hero-quote">&ldquo;Build your dreams with us.&rdquo;</p>
        <p className="hero-sub">Let us help you make it happen.</p>

        <div className="hero-actions">
          <a href="tel:+910000000000" className="btn btn-on-dark">
            Call us today
          </a>
          <a href="#about" className="btn btn-ghost" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>
            Our story
          </a>
        </div>

        <div className="hero-foot">
          <div className="hero-stats">
            <div className="hero-stat">
              <b>1940</b>
              <span>Founded</span>
            </div>
            <div className="hero-stat">
              <b>4</b>
              <span>Generations</span>
            </div>
            <div className="hero-stat">
              <b>4,000+</b>
              <span>Buildings Completed</span>
            </div>
          </div>

          <div className="scroll-cue">
            <span className="scroll-cue-line" />
            Scroll
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- About ---------------------------------- */

function About() {
  const ref = useRef<HTMLElement | null>(null);
  const [aboutPhoto, setAboutPhoto] = useState<string>("");

  useEffect(() => {
    Promise.all([siteApi.getHero(), siteApi.getAbout()])
      .then(([heroData, aboutData]) => {
        if (heroData?.about_image?.url) {
          setAboutPhoto(heroData.about_image.url);
        } else if (aboutData?.leadership?.photo?.url) {
          setAboutPhoto(aboutData.leadership.photo.url);
        } else if (aboutData?.hero?.portrait?.url) {
          setAboutPhoto(aboutData.hero.portrait.url);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out", duration: 0.9 },
      });

      tl.from(".about-content .dim-eyebrow", { y: 20, opacity: 0 })
        .from(".about-title", { y: 35, opacity: 0 }, "-=0.7")
        .from(".about-subhead", { y: 20, opacity: 0 }, "-=0.7")
        .from(".about-text", { y: 25, opacity: 0, stagger: 0.15 }, "-=0.6")
        .from(
          ".about-stat",
          {
            x: -20,
            opacity: 0,
            stagger: 0.12,
            onStart: () => {
              animateCountUp(ref.current?.querySelectorAll<HTMLElement>(".about-stat b"));
            },
          },
          "-=0.5"
        );

      gsap.from(".about-image-wrap", {
        scale: 0.92,
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-image-wrap",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".about-tag", {
        y: 25,
        opacity: 0,
        scale: 0.88,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.2,
        onStart: () => {
          animateCountUp(ref.current?.querySelectorAll<HTMLElement>(".about-tag b"));
        },
        scrollTrigger: {
          trigger: ".about-image-wrap",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [aboutPhoto]);

  return (
    <section id="about" className="section-pad" ref={ref}>
      <div className="container about-grid">
        <div className="about-content">
          <p className="dim-eyebrow">Our Story</p>
          <h2 className="about-title">About R K B Builders</h2>
          <p className="about-subhead">We build homes with a personal touch.</p>
          <p className="about-text">
            From dreams to blueprints to reality — R K B Builders can help. We are a construction
            company based in Tamil Nadu, active since 1940 — working without a formal name in our
            earliest years, long before &ldquo;R K B Builders&rdquo; was on a signboard.
          </p>
          <p className="about-text" style={{ marginTop: 14 }}>
            We specialize in bringing your dream home to life on your own land, offering
            architectural plans and designs alongside construction. Our expertise spans houses,
            buildings and apartments, with our own in-house construction services at every stage.
          </p>

          <div className="about-stats">
            <div className="about-stat">
              <b>1940</b>
              <span>Est. in Tamil Nadu</span>
            </div>
            <div className="about-stat">
              <b>3</b>
              <span>Building types</span>
            </div>
            <div className="about-stat">
              <b>In-house</b>
              <span>Design &amp; construction</span>
            </div>
          </div>
        </div>

        <div className="about-image-wrap dim-frame">
          <div className="about-image">
            {aboutPhoto ? (
              <img
                src={aboutPhoto}
                alt="A house built by R K B Builders, showcasing their architectural craftsmanship"
                loading="lazy"
              />
            ) : (
              <div style={{ width: "100%", height: "100%", minHeight: "340px", background: "rgba(16, 112, 104, 0.08)" }} />
            )}
          </div>
          <div className="about-tag">
            <b>85+</b>
            years of building trust
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Legacy ---------------------------------- */

function Legacy() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".legacy-header > *", {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".legacy-header",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".legacy-stats .stat-card", {
        y: 40,
        opacity: 0,
        scale: 0.94,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => {
          animateCountUp(ref.current?.querySelectorAll<HTMLElement>(".stat-card b"));
        },
        scrollTrigger: {
          trigger: ".legacy-stats",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      // Animated drawing of the timeline spine line
      gsap.fromTo(
        ".timeline-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 75%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        }
      );

      // Staggered reveal for timeline generation cards
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
      items.forEach((item) => {
        gsap.from(item, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        const marker = item.querySelector(".timeline-marker");
        if (marker) {
          gsap.from(marker, {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="legacy" className="legacy section-pad" ref={ref}>
      <div className="container">
        <div className="legacy-header">
          <p className="dim-eyebrow" style={{ justifyContent: "center" }}>Our Legacy</p>
          <h2 className="legacy-title">Three generations of building experience.</h2>
          <p className="legacy-sub">
            The fourth generation continues the legacy — over 4,000+ buildings successfully
            completed to date.
          </p>
        </div>

        <div className="legacy-stats">
          <div className="stat-card">
            <b>1940</b>
            <span>Founding Year</span>
          </div>
          <div className="stat-card">
            <b>4</b>
            <span>Generations of Builders</span>
          </div>
          <div className="stat-card">
            <b>4,000+</b>
            <span>Buildings Completed</span>
          </div>
        </div>

        <div className="timeline">
          <div className="timeline-spine" aria-hidden="true" />
          {LEGACY.map((person) => (
            <div className={`timeline-item${person.current ? " current" : ""}`} key={person.code}>
              <div className="timeline-marker" aria-hidden="true" />
              <span className="timeline-code">{person.code}</span>
              <p className="timeline-name">{person.name}</p>
              <p className="timeline-role">{person.role}</p>
              <p className="timeline-desc">{person.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Works ---------------------------------- */

function Works() {
  const ref = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [worksList, setWorksList] = useState<Array<{ name: string; meta: string; image: string }>>([]);

  useEffect(() => {
    siteApi.getWorks().then((apiWorks) => {
      const published = apiWorks.filter((w) => w.published !== false);
      if (published.length > 0) {
        setWorksList(
          published.map((w) => {
            const img =
              w.thumbnail?.url ||
              (w.photos && w.photos.length > 0 ? w.photos[0].url : '') ||
              '';
            return {
              name: w.title,
              meta: `${w.type} · ${w.locality || w.district || 'Tamil Nadu'}`,
              image: img,
            };
          })
        );
      }
    });
  }, []);

  function updateProgress() {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max <= 0 ? 0 : (el.scrollLeft / max) * 100;
    setProgress(pct);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }

  function scrollByCard(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".work-card");
    const distance = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: distance * direction, behavior: "smooth" });
  }

  useEffect(() => {
    updateProgress();

    if (!ref.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const header = ref.current?.querySelector(".works-header");
      if (header) {
        gsap.from(header, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const viewport = ref.current?.querySelector(".carousel-viewport");
      const cards = ref.current?.querySelectorAll(".work-card");
      if (viewport && cards && cards.length > 0) {
        gsap.from(cards, {
          y: 50,
          opacity: 0,
          scale: 0.93,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: viewport,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [worksList]);

  return (
    <section id="works" className="section-pad" ref={ref}>
      <div className="container">
        <div className="works-header">
          <div>
            <p className="dim-eyebrow">Our Works</p>
            <h2 className="works-title">Every project, a promise kept.</h2>
          </div>

          <div className="carousel-controls">
            <button
              type="button"
              className="carousel-btn"
              aria-label="Previous project"
              disabled={atStart}
              onClick={() => scrollByCard(-1)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel-btn"
              aria-label="Next project"
              disabled={atEnd}
              onClick={() => scrollByCard(1)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {worksList.length === 0 ? (
          <div style={{ padding: "3.5rem 1rem", textAlign: "center", color: "var(--dim-sub, #888)" }}>
            <p style={{ fontSize: "1rem" }}>Projects archive is being updated.</p>
          </div>
        ) : (
          <>
            <div className="carousel-viewport" ref={trackRef} onScroll={updateProgress}>
              <div className="carousel-track">
                {worksList.map((work, i) => (
                  <article className="work-card" key={`${work.name}-${i}`}>
                    {work.image ? (
                      <img
                        src={work.image}
                        alt={`${work.name} — completed project by R K B Builders`}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", minHeight: "360px", background: "rgba(16,112,104,0.08)" }} />
                    )}
                    <div className="work-card-overlay">
                      <span className="work-card-index">{String(i + 1).padStart(2, "0")} / {String(worksList.length).padStart(2, "0")}</span>
                      <p className="work-card-name">{work.name}</p>
                      <p className="work-card-meta">{work.meta}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="carousel-progress" aria-hidden="true">
              <div className="carousel-progress-bar" style={{ width: `${Math.max(progress, 8)}%` }} />
            </div>
          </>
        )}

        <div className="works-cta-row">
          <a href="/works" className="works-cta-link">
            View all works
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Why Us --------------------------------- */

const WHY_US = [
  {
    value: "1940",
    label: "Year Established",
    note: "Building since before independence",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v6M12 3l-4 2M12 3l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="14" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 10.5v3.8l2.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "4,000+",
    label: "Clients",
    note: "Families who trusted us with their land",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3.5 19c0-3.3 2.5-5.2 5.5-5.2s5.5 1.9 5.5 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="17" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15.5 13.4c2.6.2 4.5 2 4.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "4,000+",
    label: "Homes Built",
    note: "Completed, handed over, lived in",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 11.5L12 4l8 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10.5V20h12v-9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 20v-5.5h4V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function WhyUs() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".whyus-header > *", {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".whyus-header",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".whyus-card", {
        y: 55,
        opacity: 0,
        scale: 0.92,
        stagger: 0.15,
        duration: 1.0,
        ease: "power3.out",
        onStart: () => {
          animateCountUp(ref.current?.querySelectorAll<HTMLElement>(".whyus-card-value"));
        },
        scrollTrigger: {
          trigger: ".whyus-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".whyus-card-icon", {
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(2)",
        delay: 0.2,
        scrollTrigger: {
          trigger: ".whyus-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why-us" className="whyus section-pad" ref={ref}>
      <div className="container">
        <div className="whyus-header">
          <p className="dim-eyebrow">Why Us</p>
          <h2 className="whyus-title">Numbers that back up the promise.</h2>
        </div>

        <div className="whyus-grid">
          {WHY_US.map((item, i) => (
            <div className="whyus-card" key={item.label} style={{ ["--i" as string]: i }}>
              <span className="whyus-card-index">{String(i + 1).padStart(2, "0")}</span>
              <div className="whyus-card-icon">{item.icon}</div>
              <b className="whyus-card-value">{item.value}</b>
              <span className="whyus-card-label">{item.label}</span>
              <p className="whyus-card-note">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Certifications ------------------------------ */

const CERTS = [
  {
    code: "ISO 9001:2015",
    label: "Quality Management",
    image: "/ISO-9001-2015.jpg",
    scale: 1.1,
  },
  {
    code: "ISO 14001:2015",
    label: "Environmental Management",
    image: "/iso-14001-2015.jpg",
    
  },
  {
    code: "IAF",
    label: "Accredited",
    image: "/IAF-Certification.png",
    scale: 1.4,
    offsetX: 6,
    offsetY: -6,
  },
  {
    code: "MSME",
    label: "Registered",
    image: "/IMG_1181.jpeg",
    scale: 1.7,
  },
];

function Certifications() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".certs-header > *", {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".certs-header",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".cert-seal", {
        y: 40,
        scale: 0.82,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".certs-seals",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="certificate" className="certs section-pad" ref={ref}>
      <div className="container">
        <div className="certs-header">
          <p className="dim-eyebrow" style={{ justifyContent: "center" }}>Certifications</p>
          <h2 className="certs-title">ISO Certified · IAF Accredited · MSME Registered</h2>
          <p className="certs-sub">
            R K B Builders holds ISO 9001:2015 (Quality) and ISO 14001:2015 (Environmental)
            certifications with IAF accreditation and MSME registration — quality, trust and
            sustainable practice built into every project.
          </p>
        </div>

        <div className="certs-seals">
          {CERTS.map((cert) => (
            <div className="cert-seal" key={cert.code}>
              <div className="cert-seal-ring">
                <div className="cert-seal-img-wrapper">
                  <Image
                    src={cert.image}
                    alt={`${cert.code} - ${cert.label}`}
                    fill
                    sizes="(max-width: 768px) 130px, 150px"
                    className="cert-seal-img"
                    style={
                      {
                        "--img-scale": cert.scale ?? 1,
                        "--img-x": cert.offsetX ? `${cert.offsetX}px` : "0px",
                        "--img-y": cert.offsetY ? `${cert.offsetY}px` : "0px",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <div className="cert-seal-info">
                <span className="cert-seal-code">{cert.code}</span>
                <span className="cert-seal-label">{cert.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}