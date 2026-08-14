"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CTASectionProps {
  id?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export default function CTASection({
  id = "cta",
  title = "Ready to build your dream home?",
  description = "Call us today and let's turn your land into a home you'll love for generations.",
  buttonText = "Call us today",
  buttonHref = "tel:+916380170943",
  className = "",
}: CTASectionProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(".cta-strip", {
        y: 45,
        scale: 0.96,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      })
        .from(".cta-strip h3", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.6")
        .from(".cta-strip p", { y: 15, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
        .from(".cta-strip .btn", { scale: 0.88, opacity: 0, duration: 0.7, ease: "back.out(1.8)" }, "-=0.5");
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} className={`section-pad ${className}`} ref={ref}>
      <div className="container">
        <div className="cta-strip">
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <a
            href={buttonHref}
            className="btn"
            style={{ background: "var(--color-on-accent)", color: "var(--color-accent)" }}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
