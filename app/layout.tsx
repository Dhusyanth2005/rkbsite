import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "R K B Builders — Build your dreams with us",
  description:
    "R K B Builders is a construction company based in Tamil Nadu, active since 1940. Three generations of building experience — houses, buildings and apartments, from blueprint to reality.",
};

const NAV_LINKS_1 = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/works", label: "Our Works" },
  { href: "/services", label: "Services" },
];

const NAV_LINKS_2 = [
  { href: "/#legacy", label: "Our Legacy" },
  { href: "/#certificate", label: "Certifications" },
  { href: "/contact", label: "Contact Us" },
];

const SOCIAL_LINKS = [
  {
    id: "youtube",
    name: "YouTube",
    href: "https://www.youtube.com/@rkbbuilders",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    name: "Instagram",
    href: "https://www.instagram.com/rkbbuilders",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/r-k-b-builders/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    href: "https://www.facebook.com/share/mEqE1xE4GsLmMcV1/?mibextid=WC7FNe",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

// Runs before hydration so the correct theme is painted on the very first
// frame — prevents the light/dark flash on load.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    var stored = localStorage.getItem("rkb-theme");
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

// Nav is now a client component in components/Navbar.tsx

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/rkblogo.PNG"
              alt="R K B Builders"
              width={60}
              height={18}
              style={{ objectFit: "contain", width: "auto", height: "auto", marginBottom: "8px" }}
            />
            <span className="logo-text">
              R K B BUILDERS
              <span>EST. 1940 · TAMIL NADU</span>
            </span>
            <p>
              We build homes with a personal touch — from dreams to blueprints to reality. Three
              generations of building experience, now carried forward by the fourth.
            </p>
            <div className="footer-social">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`footer-social-link footer-social-link--${s.id}`}
                  aria-label={`Visit R K B Builders on ${s.name}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-heading">Navigate</p>
            <ul className="footer-links">
              {NAV_LINKS_1.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-heading">Company</p>
            <ul className="footer-links">
              {NAV_LINKS_2.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-heading">Contact</p>
            <ul className="footer-links">
              <li><a href="tel:+916380170943">+91 63801 70943</a></li>
              <li><a href="tel:+918610586727">+91 86105 86727</a></li>
              <li><a href="mailto:tamilpriyan112@gmail.com">tamilpriyan112@gmail.com</a></li>
              <li style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--color-text-muted)" }}>
                Main Road, Ullikkottai (Post),<br />
                Mannargudi (T.K), Thiruvarur (Dist.) - 614018
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} R K B Builders. All rights reserved.</span>
          <span>Building since 1940 — four generations strong.</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body id="top">
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}