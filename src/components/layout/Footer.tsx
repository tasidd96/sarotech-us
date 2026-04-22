"use client";

import Link from "next/link";
import Image from "next/image";
import TypewriterHeading from "@/components/home/TypewriterHeading";

const FOOTER_TAGLINE_PREFIX = "Next-generation architectural finishes,";
const FOOTER_TAGLINE_SUFFIXES = [
  "at your fingertips.",
  "ready to ship.",
  "promised to deliver.",
];

const navLinks = [
  { href: "/locations", label: "Locations" },
  { href: "/products", label: "Catalog" },
  { href: "/about", label: "About Us" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/sarotech.us",
    icon: (
      <svg width={20} height={20} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sarotech.us",
    icon: (
      <svg width={20} height={20} fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1a1a1a",
        color: "#fff",
        fontFamily: "PasticheGrotesque, Arial, sans-serif",
        padding: "3rem 0 1.5rem",
      }}
    >
      {/* Wrapper */}
      <div
        className="container-std"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
        }}
      >
        {/* Section Top */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* Brand row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Image
              src="/images/SaroTech_Isotipo_01.png"
              alt="SARO TECH"
              width={50}
              height={50}
              style={{ width: 50, height: "auto", flexShrink: 0 }}
            />
            <div style={{ flex: "1 1 260px", minWidth: 0 }}>
              <p className="m-0 text-[1rem] leading-[1.4] text-white sm:text-[1.15rem] lg:text-[1.2rem]">
                {FOOTER_TAGLINE_PREFIX}
              </p>
              <TypewriterHeading
                as="p"
                messages={FOOTER_TAGLINE_SUFFIXES}
                typeSpeed={45}
                deleteSpeed={25}
                holdMs={2600}
                className="m-0 text-[1rem] leading-[1.4] text-white sm:text-[1.15rem] lg:text-[1.2rem]"
              />
            </div>
          </div>

          {/* Content row — 3 columns */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "2rem",
              alignItems: "flex-start",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            {/* Explore column */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  fontFamily: "PasticheGrotesque, Arial, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  margin: "0 0 1rem",
                  color: "#fff",
                }}
              >
                Explore
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: "PasticheGrotesque, Arial, sans-serif",
                        color: "#ccc",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        transition: "color 0.3s ease",
                      }}
                      className="footer-nav-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Assistance column */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  fontFamily: "PasticheGrotesque, Arial, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  margin: "0 0 1rem",
                  color: "#fff",
                }}
              >
                Customer Assistance
              </p>
              <p
                style={{
                  fontFamily: "PasticheGrotesque, Arial, sans-serif",
                  color: "#ccc",
                  fontSize: "0.95rem",
                  marginBottom: "0.2rem",
                }}
              >
                Contact
              </p>
              <a
                href="tel:+18325551234"
                style={{
                  fontFamily: "PasticheGrotesque, Arial, sans-serif",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                }}
              >
                (832) 555-1234
              </a>
            </div>

            {/* CTA column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p
                style={{
                  fontFamily: "PasticheGrotesque, Arial, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 400,
                  margin: "0 0 0.5rem",
                  color: "#fff",
                }}
              >
                Have a question or suggestion?
              </p>
              <a
                href="mailto:info@sarotech.us"
                style={{
                  fontFamily: "PasticheGrotesque, Arial, sans-serif",
                  fontSize: "1rem",
                  color: "#3d8556",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  fontWeight: 500,
                }}
                className="footer-email-link"
              >
                info@sarotech.us
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 2,
            overflow: "hidden",
            position: "relative",
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        />

        {/* Section Bottom — legal + social */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
          className="footer-bottom-grid"
        >
          {/* Legal links */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <Link
              href="/terms"
              style={{
                fontFamily: "PasticheGrotesque, Arial, sans-serif",
                color: "#ccc",
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "color 0.3s ease",
                whiteSpace: "nowrap",
              }}
              className="footer-nav-link"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/support"
              style={{
                fontFamily: "PasticheGrotesque, Arial, sans-serif",
                color: "#ccc",
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "color 0.3s ease",
                whiteSpace: "nowrap",
              }}
              className="footer-nav-link"
            >
              Help &amp; Support
            </Link>
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  color: "#fff",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                className="footer-social-icon"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-nav-link:hover {
          color: #3d8556 !important;
        }
        .footer-email-link:hover {
          color: #2d6340 !important;
        }
        .footer-social-icon:hover {
          background-color: #3d8556;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .footer-bottom-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
