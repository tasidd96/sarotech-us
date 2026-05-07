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
            <ul className="nav-list" style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
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
            {/* Call */}
            <a
              href="tel:+18324476566"
              className="call-btn"
              aria-label="Call SARO TECH"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                transition: "transform 0.3s ease",
                color: "#fff",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
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

        {/* Mobile call button — right column, hidden on desktop. Note:
            display lives on the className (`flex md:hidden`) so the
            md-breakpoint hide rule actually wins. Earlier this had an
            inline `display: flex` which clobbered `md:hidden` and made
            the icon show on desktop too. */}
        <a
          href="tel:+18324476566"
          aria-label="Call SARO TECH"
          className="flex items-center justify-center md:hidden"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            color: "#fff",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
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
