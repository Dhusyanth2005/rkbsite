import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "R K B Builders — Build your dreams with us",
  description:
    "R K B Builders is a construction company based in Tamil Nadu, active since 1940. Three generations of building experience — houses, buildings and apartments, from blueprint to reality.",
};

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/services", label: "Services" },
  { href: "/#legacy", label: "Legacy" },
  { href: "/#certificate", label: "Certificate" },
]; // kept for Footer

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
          </div>

          <div>
            <p className="footer-heading">Navigate</p>
            <ul className="footer-links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-heading">Services</p>
            <ul className="footer-links">
              <li><a href="#works">Custom Homes</a></li>
              <li><a href="#works">Apartments</a></li>
              <li><a href="#works">Commercial Buildings</a></li>
              <li><a href="#about">Architectural Design</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-heading">Contact</p>
            <ul className="footer-links">
              <li><a href="tel:+910000000000">+91 00000 00000</a></li>
              <li><a href="mailto:info@rkbbuilders.in">info@rkbbuilders.in</a></li>
              <li>Tamil Nadu, India</li>
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
        </SmoothScroll>
      </body>
    </html>
  );
}