"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./aboutstyle.css";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const CREDENTIALS = [
  "B.E. — Civil Engineering",
  "M.Plan — Urban Planning",
  "Licensed & Govt. Registered Civil Engineer",
  "Associate Member, Institute of Town Planners India (ITPI)",
];

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
  return (
    <main className="about-page">
      <div className="about-hero-desktop">
        <AboutHero />
      </div>
      <Leadership />
      <PhilosophyMobile />
      <WhatSetsUsApart />
    </main>
  );
}

/* ------------------------------ Scroll-Expand Hero ------------------------------ */
/*
   Signature moment for this page:
   - At rest, the photo of Er. Tamilpriyan sits in a small, passport-sized
     frame (portrait 3:4, echoing an ID photo), with his name and title as
     a plain caption *below* the frame.
   - As the visitor scrolls, the frame expands to fill the viewport. The
     passport caption fades away, and the philosophy quote fades in,
     overlaid on the bottom of the now full-bleed photo.
*/

function AboutHero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
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

        tl.to(".about-expand-media", {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          ease: "none",
        })
          .to(".about-expand-frame-tick", { opacity: 0, scale: 0.6, ease: "none" }, "<")
          .to(".about-passport-caption", { opacity: 0, y: -18, ease: "none" }, "<")
          .to(".about-expand-veil", { opacity: 0.6, ease: "none" }, "<+=0.1")
          .fromTo(
            ".about-expand-philosophy",
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, ease: "none" },
            "-=0.4"
          );

        return () => tl.scrollTrigger?.kill();
      });

      // Mobile: simple, non-pinned reveal — philosophy sits under the photo
      mm.add("(max-width: 779px)", () => {
        gsap.from(".about-expand-media", {
          scale: 0.92,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
        gsap.from(".about-passport-caption", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
        gsap.from(".about-mobile-philosophy", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".about-mobile-philosophy", start: "top 85%" },
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about-hero" id="about-hero" ref={sectionRef}>
      <div className="about-expand-stage">
        <div className="about-expand-media">
          <img
            src="/tamilpriyan-site.jpg"
            alt="Er. R K B Tamilpriyan, Managing Director of R K B Builders"
          />
          <div className="about-expand-veil" aria-hidden="true" />
          <span className="about-expand-frame-tick corner-tl" aria-hidden="true" />
          <span className="about-expand-frame-tick corner-br" aria-hidden="true" />

          {/* Philosophy quote — hidden until the frame expands */}
          <div className="about-expand-philosophy">
            <blockquote className="about-expand-quote">
              &ldquo;Our primordial principle is to construct structures that are in harmony with
              both the client&rsquo;s interest and ecological sustenance.&rdquo;
            </blockquote>
            <p className="about-expand-quote-attr">— Er. R K B Tamilpriyan, Managing Director</p>
          </div>
        </div>

        {/* Passport-style caption — visible only while the frame is small */}
        <div className="about-passport-caption">
          <p className="dim-eyebrow">R K B Builders · About Us</p>
          <h1 className="about-passport-name">Er. R K B Tamilpriyan</h1>
          <p className="about-passport-role">Civil Engineer &amp; Urban Planner</p>
        </div>
      </div>

      {/* Mobile-only fallback: philosophy quote shown as plain text under the photo,
          since the pinned overlay effect is disabled on small screens. */}
      <p className="about-mobile-philosophy">
        &ldquo;Our primordial principle is to construct structures that are in harmony with both
        the client&rsquo;s interest and ecological sustenance.&rdquo;
        <span>— Er. R K B Tamilpriyan, Managing Director</span>
      </p>
    </section>
  );
}

/* ---------------------------------- Leadership ---------------------------------- */

function Leadership() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".leadership-photo-wrap", {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 72%", toggleActions: "play none none reverse" },
        defaults: { ease: "power3.out", duration: 0.85 },
      });

      tl.from(".leadership-content .dim-eyebrow", { y: 18, opacity: 0 })
        .from(".leadership-name", { y: 26, opacity: 0 }, "-=0.6")
        .from(".leadership-role", { y: 18, opacity: 0 }, "-=0.6")
        .from(".leadership-credential", { x: -16, opacity: 0, stagger: 0.08 }, "-=0.45")
        .from(".leadership-text", { y: 18, opacity: 0 }, "-=0.4");
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="leadership" className="section-pad leadership" ref={ref}>
      <div className="container leadership-grid">
        <div className="leadership-photo-wrap dim-frame">
          <div className="leadership-photo">
            <img
              src="/preEdit.jpg"
              alt="Er. R K B Tamilpriyan, Managing Director of R K B Builders, on site with architectural plans"
              loading="lazy"
            />
          </div>
          <div className="leadership-tag">
            <b>G-04</b>
            <span>Managing Director</span>
          </div>
        </div>

        <div className="leadership-content">
          <p className="dim-eyebrow">Leadership</p>
          <h2 className="leadership-name">Er. R K B Tamilpriyan</h2>
          <p className="leadership-role">Civil Engineer &amp; Urban Planner</p>

          <ul className="leadership-credentials">
            {CREDENTIALS.map((c) => (
              <li className="leadership-credential" key={c}>
                {c}
              </li>
            ))}
          </ul>

          <p className="leadership-text">
            The fourth generation to lead R K B Builders, Er. Tamilpriyan pairs formal training in
            civil engineering and urban planning with a family practice that stretches back to
            1940 — bringing licensed, government-registered oversight to every drawing, site and
            handover.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Mobile Philosophy ------------------------------ */

function PhilosophyMobile() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".phil-mobile-quote", {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
      gsap.from(".phil-mobile-attr", {
        y: 16,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="phil-mobile section-pad" ref={ref} aria-label="Our philosophy">
      <div className="container">
        <p className="dim-eyebrow">Our Philosophy</p>
        <blockquote className="phil-mobile-quote">
          &ldquo;Our primordial principle is to construct structures that are in harmony with
          both the client&rsquo;s interest and ecological sustenance.&rdquo;
        </blockquote>
        <p className="phil-mobile-attr">— Er. R K B Tamilpriyan, Managing Director</p>
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

        {/* Editorial closing statement — replaces a plain paragraph with a
            two-part "promise" band: supporting copy on the left, a large
            display statement + CTA on the right. */}
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
              <a href="#contact" className="apart-closing-cta">
                Start the conversation <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}