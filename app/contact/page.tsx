"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { CheckCircle2 } from "lucide-react";
import "./contactstyle.css";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

// Office location — Thanjavur, Tamil Nadu
const OFFICE_COORDS: [number, number] = [10.598334787765896, 79.41481216707771];

const CONTACT_CARDS = [
  {
    code: "01",
    label: "Call Us",
    value: "+91 63801 70943 / +91 86105 86727",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M6.6 10.8c1.4 2.9 3.7 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1.1.5 1.1 1.1V20c0 .6-.5 1.1-1.1 1.1C10.6 21.1 2.9 13.4 2.9 3.9 2.9 3.3 3.4 2.8 4 2.8h3.3c.6 0 1.1.5 1.1 1.1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1L6.6 10.8z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    code: "02",
    label: "Email Us",
    value: "tamilpriyan112@gmail.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    code: "03",
    label: "Visit Us",
    value: "Main Road, Ullikkottai, Mannargudi, Thiruvarur - 614018",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    code: "04",
    label: "Office Hours",
    value: "Mon – Sat · 9:00 AM – 6:00 PM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactBody />
    </>
  );
}

/* --------------------------------- Hero --------------------------------- */

function ContactHero() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-hero-eyebrow, .contact-hero-title, .contact-hero-sub", {
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="contact-hero" ref={ref}>
      <div className="container">
        <p className="dim-eyebrow contact-hero-eyebrow">Get In Touch</p>
        <h1 className="contact-hero-title">Let&rsquo;s build your dream together.</h1>
        <p className="contact-hero-sub">
          Have land and a vision? Tell us about your project and our team will get back to you —
          from the first sketch to the final handover.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- Body / Grid ------------------------------ */

function ContactBody() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".contact-cards", {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-cards",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".contact-map-wrap", {
        scale: 0.96,
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-map-wrap",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".contact-form-panel", {
        x: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-form-panel",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contact-body" ref={ref}>
      <div className="container">
        <div className="contact-cards">
          {CONTACT_CARDS.map((card) => (
            <div className="contact-card" key={card.code}>
              <span className="contact-card-index">{card.code}</span>
              <div className="contact-card-icon">{card.icon}</div>
              <span className="contact-card-label">{card.label}</span>
              <p className="contact-card-value">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="contact-split">
          <div className="contact-map-wrap dim-frame">
            <ContactMap />
            <div className="contact-map-tag">
              <b>Ullikkottai</b>
              Mannargudi, Thiruvarur - 614018
            </div>
          </div>

          <div className="contact-form-panel">
            <p className="dim-eyebrow">Send A Message</p>
            <h2 className="contact-form-title">Tell us about your project</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Map ------------------------------------- */

function ContactMap() {
  return (
    <div
      className="contact-map"
      role="region"
      aria-label="Satellite map of R K B Builders office in Thiruvarur, Tamil Nadu"
    >
      <iframe
        title="R K B Builders Location"
        src="https://maps.google.com/maps?q=10.598334787765896,79.41481216707771&t=k&z=17&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        loading="eager"
        style={{ border: 0, width: "100%", height: "100%", display: "block" }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

/* -------------------------------- Contact Form ----------------------------- */

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const EMPTY_FORM: FormState = { name: "", phone: "", email: "", message: "" };

function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS credentials missing from environment variables.");
      setStatus("error");
      setStatusMessage("Email service is not configured. Please set EmailJS keys in .env.local.");
      return;
    }

    try {
      setStatus("loading");
      setStatusMessage("");

      const templateParams = {
        name: form.name,
        from_name: form.name,
        phone: form.phone,
        contact_number: form.phone,
        email: form.email,
        from_email: form.email,
        reply_to: form.email,
        message: form.message,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setStatus("success");
      setStatusMessage("");
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus("error");
      setStatusMessage("Failed to send message. Please try again or reach us via phone/WhatsApp.");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-success-card">
        <div className="contact-success-icon-wrap">
          <CheckCircle2 size={46} strokeWidth={2.3} />
        </div>
        <h3 className="contact-success-title">Message Sent Successfully!</h3>
        <p className="contact-success-desc">
          Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setStatusMessage("");
          }}
          className="btn btn-primary contact-success-btn"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-row">
        <label className="contact-field">
          <span>Name</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name"
            disabled={status === "loading"}
          />
        </label>
        <label className="contact-field">
          <span>Phone</span>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 00000 00000"
            disabled={status === "loading"}
          />
        </label>
      </div>

      <label className="contact-field">
        <span>Email</span>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          disabled={status === "loading"}
        />
      </label>

      <label className="contact-field">
        <span>Tell us about your project</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Plot size, location, and what you have in mind…"
          disabled={status === "loading"}
        />
      </label>

      <div className="contact-form-footer">
        <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send message"}
        </button>
        {statusMessage && (
          <span className={`contact-form-status ${status === "error" ? "error" : "success"}`}>
            {statusMessage}
          </span>
        )}
      </div>
    </form>
  );
}