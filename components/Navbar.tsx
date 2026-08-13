"use client";

import { useState } from "react";
import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/services", label: "Services" },
  { href: "/#legacy", label: "Legacy" },
  { href: "/#certificate", label: "Certificate" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="/" className="logo" aria-label="R K B Builders home">
          <Image
            src="/rkblogo.PNG"
            alt="R K B Builders"
            width={60}
            height={18}
            style={{ objectFit: "contain", width: "auto", height: "auto" }}
            priority
          />
          <span className="logo-text">
            R K B BUILDERS
            <span>EST. 1940 · TAMIL NADU</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <ThemeSwitcher />
          <a href="/contact" className="btn btn-primary" style={{ padding: "12px 22px" }}>
            Contact Us
          </a>
          <button
            className={`nav-toggle${open ? " nav-toggle--open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            type="button"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu${open ? " open" : ""}`} aria-hidden={!open}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
        <a
          href="/contact"
          className="btn btn-primary"
          onClick={close}
          style={{ marginTop: "8px", justifyContent: "center" }}
        >
          Contact Us
        </a>
      </div>
    </header>
  );
}
