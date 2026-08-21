"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteApi, AboutData } from "@/services/api";
import "./aboutstyle.css";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const APART = [
  {
    code: "01",
    title: "We listen first",
    desc: "We take the time to understand your needs and wants, and work with you to create a home you'll love.",
  },
  {
    code: "02",
    title: "Only the best materials",
    desc: "We use only the highest quality materials and construction methods in every home we build.",
  },
  {
    code: "03",
    title: "An experience you deserve",
    desc: "We believe our customers deserve the best possible experience — and we're committed to providing exactly that.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    siteApi.getAbout().then((data) => {
      if (data) setAboutData(data);
    });
  }, []);

  return (
    <main className="about-page">
      <div className="about-hero-desktop">
        <AboutHero hero={aboutData?.hero} />
      </div>
      <Leadership leadership={aboutData?.leadership} />
      <PhilosophyMobile hero={aboutData?.hero} />
      <WhatSetsUsApart />
    </main>
  );
}

/* ------------------------------ Scroll-Expand Hero ------------------------------ */

function AboutHero({ hero }: { hero?: AboutData["hero"] }) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop / tablet: pinned scroll-expand
      mm.add("(min-width: 780px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        const media = sectionRef.current?.querySelector(".about-expand-media");
        if (media) {
          tl.to(media, {
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            ease: "none",
          });
        }

        const ticks = sectionRef.current?.querySelectorAll(".about-expand-frame-tick");
        if (ticks && ticks.length > 0) {
          tl.to(ticks, { opacity: 0, scale: 0.6, ease: "none" }, "<");
        }

        const caption = sectionRef.current?.querySelector(".about-passport-caption");
        if (caption) {
          tl.to(caption, { opacity: 0, y: -18, ease: "none" }, "<");
        }

        const veil = sectionRef.current?.querySelector(".about-expand-veil");
        if (veil) {
          tl.to(veil, { opacity: 0.6, ease: "none" }, "<+=0.1");
        }

        const philosophy = sectionRef.current?.querySelector(".about-expand-philosophy");
        if (philosophy) {
          tl.fromTo(
            philosophy,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, ease: "none" },
            "-=0.4"
          );
        }

        return () => tl.scrollTrigger?.kill();
      });

      // Mobile: simple, non-pinned reveal — philosophy sits under the photo
      mm.add("(max-width: 779px)", () => {
        const media = sectionRef.current?.querySelector(".about-expand-media");
        if (media) {
          gsap.from(media, {
            scale: 0.92,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          });
        }

        const caption = sectionRef.current?.querySelector(".about-passport-caption");
        if (caption) {
          gsap.from(caption, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            delay: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          });
        }

        const mobilePhil = sectionRef.current?.querySelector(".about-mobile-philosophy");
        if (mobilePhil) {
          gsap.from(mobilePhil, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: mobilePhil, start: "top 85%" },
          });
        }
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, [hero]);

  const portraitSrc = hero?.portrait?.url || "";
  const portraitAlt = hero?.portrait?.alt || hero?.name || "Architect portrait";
  const name = hero?.name || "";
  const role = hero?.role || "";
  const quote = hero?.philosophy_quote || "";
  const quoteAttr = hero?.philosophy_attr || "";

  return (
    <section className="about-hero" id="about-hero" ref={sectionRef}>
      <div className="about-expand-stage">
        <div className="about-expand-media">
          {portraitSrc ? (
            <img
              src={portraitSrc}
              alt={portraitAlt}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #107068, #0a4d47)" }} />
          )}
          <div className="about-expand-veil" aria-hidden="true" />
          <span className="about-expand-frame-tick corner-tl" aria-hidden="true" />
          <span className="about-expand-frame-tick corner-br" aria-hidden="true" />

          {/* Philosophy quote — hidden until the frame expands */}
          {quote && (
            <div className="about-expand-philosophy">
              <blockquote className="about-expand-quote">
                &ldquo;{quote}&rdquo;
              </blockquote>
              {quoteAttr && <p className="about-expand-quote-attr">{quoteAttr}</p>}
            </div>
          )}
        </div>

        {/* Passport-style caption — visible only while the frame is small */}
        {(name || role) && (
          <div className="about-passport-caption">
            <p className="dim-eyebrow">R K B Builders · About Us</p>
            {name && <h1 className="about-passport-name">{name}</h1>}
            {role && <p className="about-passport-role">{role}</p>}
          </div>
        )}
      </div>

      {/* Mobile-only fallback */}
      {quote && (
        <p className="about-mobile-philosophy">
          &ldquo;{quote}&rdquo;
          {quoteAttr && <span>{quoteAttr}</span>}
        </p>
      )}
    </section>
  );
}

/* ---------------------------------- Leadership ---------------------------------- */

function Leadership({ leadership }: { leadership?: AboutData["leadership"] }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const photoWrap = ref.current?.querySelector(".leadership-photo-wrap");
      if (photoWrap) {
        gsap.from(photoWrap, {
          x: -40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
        });
      }

      const content = ref.current?.querySelector(".leadership-content");
      if (content) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top 72%", toggleActions: "play none none reverse" },
          defaults: { ease: "power3.out", duration: 0.85 },
        });

        const eyebrow = content.querySelector(".dim-eyebrow");
        if (eyebrow) tl.from(eyebrow, { y: 18, opacity: 0 });

        const nameEl = content.querySelector(".leadership-name");
        if (nameEl) tl.from(nameEl, { y: 26, opacity: 0 }, "-=0.6");

        const roleEl = content.querySelector(".leadership-role");
        if (roleEl) tl.from(roleEl, { y: 18, opacity: 0 }, "-=0.6");

        const creds = content.querySelectorAll(".leadership-credential");
        if (creds && creds.length > 0) tl.from(creds, { x: -16, opacity: 0, stagger: 0.08 }, "-=0.45");

        const textEl = content.querySelector(".leadership-text");
        if (textEl) tl.from(textEl, { y: 18, opacity: 0 }, "-=0.4");
      }
    }, ref);

    return () => ctx.revert();
  }, [leadership]);

  const photoSrc = leadership?.photo?.url || "";
  const photoAlt = leadership?.photo?.alt || leadership?.name || "Leadership photo";
  const name = leadership?.name || "";
  const role = leadership?.role || "";
  const credentials = leadership?.credentials || [];
  const bio = leadership?.bio || "";

  return (
    <section id="leadership" className="section-pad leadership" ref={ref}>
      <div className="container leadership-grid">
        <div className="leadership-photo-wrap dim-frame">
          <div className="leadership-photo">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt={photoAlt}
                loading="lazy"
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "rgba(16, 112, 104, 0.08)" }} />
            )}
          </div>
          <div className="leadership-tag">
            <b>G-04</b>
            <span>Managing Director</span>
          </div>
        </div>

        <div className="leadership-content">
          <p className="dim-eyebrow">Leadership</p>
          {name && <h2 className="leadership-name">{name}</h2>}
          {role && <p className="leadership-role">{role}</p>}

          {credentials.length > 0 && (
            <ul className="leadership-credentials">
              {credentials.map((c, i) => (
                <li className="leadership-credential" key={`${c}-${i}`}>
                  {c}
                </li>
              ))}
            </ul>
          )}

          {bio && <p className="leadership-text">{bio}</p>}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Mobile Philosophy ------------------------------ */

function PhilosophyMobile({ hero }: { hero?: AboutData["hero"] }) {
  const ref = useRef<HTMLElement | null>(null);
  const quote = hero?.philosophy_quote || "";
  const quoteAttr = hero?.philosophy_attr || "";

  useEffect(() => {
    if (!ref.current || !quote) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const q = ref.current?.querySelector(".phil-mobile-quote");
      if (q) {
        gsap.from(q, {
          y: 28,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        });
      }

      const attr = ref.current?.querySelector(".phil-mobile-attr");
      if (attr) {
        gsap.from(attr, {
          y: 16,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [hero, quote]);

  if (!quote) return null;

  return (
    <section className="phil-mobile section-pad" ref={ref} aria-label="Our philosophy">
      <div className="container">
        <p className="dim-eyebrow">Our Philosophy</p>
        <blockquote className="phil-mobile-quote">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {quoteAttr && <p className="phil-mobile-attr">{quoteAttr}</p>}
      </div>
    </section>
  );
}

/* ------------------------------ What Sets Us Apart ------------------------------ */

function WhatSetsUsApart() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 78%", toggleActions: "play none none reverse" },
        defaults: { ease: "power3.out", duration: 0.85 },
      });

      tl.from(".apart-header .dim-eyebrow", { y: 18, opacity: 0 })
        .from(".apart-title", { y: 26, opacity: 0 }, "-=0.6")
        .from(".apart-lede", { y: 18, opacity: 0 }, "-=0.55");

      gsap.from(".apart-card", {
        y: 45,
        opacity: 0,
        scale: 0.95,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".apart-grid", start: "top 82%", toggleActions: "play none none reverse" },
      });

      gsap.from(".apart-closing-band", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".apart-closing-band", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.fromTo(
        ".apart-closing-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".apart-closing-band", start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="what-sets-us-apart" className="apart section-pad" ref={ref}>
      <div className="container">
        <div className="apart-header">
          <p className="dim-eyebrow">What Sets Us Apart</p>
          <h2 className="apart-title">Our differentiating factor is simple.</h2>
          <p className="apart-lede">
            It&rsquo;s our commitment to customer satisfaction and our focus on quality. We take
            the time to understand our customers&rsquo; needs and wants, and we work with them to
            create a home they will love.
          </p>
        </div>

        <div className="apart-grid">
          {APART.map((item) => (
            <div className="apart-card" key={item.code}>
              <span className="apart-card-ghost" aria-hidden="true">
                {item.code}
              </span>
              <span className="apart-card-code">{item.code}</span>
              <h3 className="apart-card-title">{item.title}</h3>
              <p className="apart-card-desc">{item.desc}</p>
              <span className="apart-card-line" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="apart-closing-band">
          <span className="apart-closing-rule" aria-hidden="true" />

          <div className="apart-closing-copy">
            <p className="dim-eyebrow">Our Promise</p>
            <p className="apart-closing-support">
              We use only the highest quality materials and construction methods in our homes.
              We believe our customers deserve the best possible experience, and we&rsquo;re
              committed to providing them with just that.
            </p>
          </div>

          <div className="apart-closing-statement">
            <p className="apart-closing-lead">
              We&rsquo;re confident <span>R K B Builders, Mannargudi</span> is the best choice
              for your home building needs.
            </p>
            <div className="apart-closing-foot">
              <p className="apart-closing-sub">
                And we&rsquo;d be honoured to work with you to create your dream home.
              </p>
              <a href="/contact" className="apart-closing-cta">
                Start the conversation <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}