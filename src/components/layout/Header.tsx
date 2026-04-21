"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "HOME", mobileLabel: "Home" },
  { href: "/products", label: "PRODUCTS", mobileLabel: "Products" },
  { href: "/projects", label: "PROJECTS", mobileLabel: "Projects" },
  { href: "/locations", label: "LOCATIONS", mobileLabel: "Locations" },
  { href: "/saro-rewards", label: "SARO REWARDS", mobileLabel: "Saro Rewards" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#1a1a1a",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        fontFamily: "PasticheGrotesque, Arial, sans-serif",
      }}
    >
      {/* ── Desktop + Tablet header bar ── */}
      <div
        className="header-container-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        {/* Hamburger — mobile only */}
        <button
          className={`hamburger-menu md:hidden${mobileOpen ? " active" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <div className="hamburger-icon">
            <span />
            <span />
            <span />
          </div>
        </button>

        {/* Logo — left-aligned on desktop (matches source), centered on mobile */}
        <div
          className="logo-section-wrapper"
          style={{
            flex: "0 0 30%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Image
              src="/images/saro-tech-logo.png"
              alt="SARO TECH"
              width={281}
              height={50}
              priority
              style={{ height: 50, width: "auto", objectFit: "contain" }}
              className="hidden md:block"
            />
            {/* Mobile logo — matches source 41px */}
            <Image
              src="/images/saro-tech-logo.png"
              alt="SARO TECH"
              width={225}
              height={41}
              priority
              style={{ height: 41, width: "auto", objectFit: "contain" }}
              className="block md:hidden"
            />
          </Link>
        </div>

        {/* Desktop nav + actions — 70%, hidden on mobile */}
        <div
          className="hidden md:flex"
          style={{
            flex: "0 0 70%",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          {/* Nav list */}
          <nav style={{ flex: "1 1 0", minWidth: 0, display: "flex", justifyContent: "flex-end" }}>
            <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <li
                    key={link.label}
                    style={{ position: "relative", display: "flex", alignItems: "center" }}
                  >
                    <Link
                      href={link.href}
                      className={`nav-link-item${isActive ? " nav-active" : ""}`}
                    >
                      {link.label}
                    </Link>

                    {/* Separator */}
                    {i < navLinks.length - 1 && (
                      <span
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 0,
                          height: 14,
                          outline: "1px solid rgba(255,255,255,1)",
                          outlineOffset: 0,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginLeft: "1rem",
              paddingRight: "16px",
              flexShrink: 0,
            }}
          >
            {/* WhatsApp */}
            <a
              href="https://wa.me/15212351295"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
              aria-label="Contact via WhatsApp"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                transition: "transform 0.3s ease",
                backgroundImage: "url(/images/WhatsBlanco.png)",
                backgroundSize: "20px 20px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            {/* Search */}
            <button
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#fff",
                padding: 0,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile WhatsApp — right column, hidden on desktop */}
        <a
          href="https://wa.me/15212351295"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact via WhatsApp"
          className="md:hidden"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundImage: "url(/images/WhatsBlanco.png)",
            backgroundSize: "26px 26px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* ── Mobile nav carousel strip ── */}
      <div className={`nav-carousel-strip${mobileOpen ? " active" : ""}`}>
        <div className="nav-carousel-container">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-carousel-item${isActive ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.mobileLabel}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
