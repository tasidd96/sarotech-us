"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ProductCategory, ProductType } from "@/lib/types";
import { productTypeLabels } from "@/data/products";
import { products } from "@/data/products";

type MenuKey = ProductCategory;

const MENU_ITEMS: { key: MenuKey; desktop: string; mobile: string }[] = [
  { key: "interior", desktop: "INTERIOR PRODUCTS", mobile: "INTERIOR" },
  { key: "exterior", desktop: "EXTERIOR PRODUCTS", mobile: "EXTERIOR" },
];

function typesForCategory(cat: MenuKey): ProductType[] {
  const set = new Set<ProductType>();
  for (const p of products) if (p.category === cat) set.add(p.productType);
  return Array.from(set);
}

export default function ProductsSubNav() {
  const [openKey, setOpenKey] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  };

  return (
    <div
      className="products-menu-container white-menu relative"
      style={{ backgroundColor: "rgb(26,26,26)", height: "64px" }}
      onMouseLeave={scheduleClose}
    >
      <nav className="products-main-menu container-lg flex h-[64px] items-center justify-center">
        {MENU_ITEMS.map((item) => {
          const isOpen = openKey === item.key;
          return (
            <Link
              key={item.key}
              href={`/products?tab=${item.key}`}
              onMouseEnter={() => {
                cancelClose();
                setOpenKey(item.key);
              }}
              onFocus={() => setOpenKey(item.key)}
              className="menu-item flex h-[64px] cursor-pointer items-center px-10 py-5 text-center transition-[color] duration-300"
            >
              <span
                className={`menu-title relative block ${isOpen ? "active" : ""}`}
                style={{
                  color: "#ffffff",
                  fontFamily:
                    "PasticheGrotesque, Arial, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  lineHeight: "24px",
                  textTransform: "uppercase",
                  transition: "color 0.3s",
                }}
              >
                <span className="menu-title-desktop hidden md:inline">
                  {item.desktop}
                </span>
                <span className="menu-title-mobile md:hidden">
                  {item.mobile}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Hover dropdown — animation: fadeInDown 0.3s ease */}
      {openKey && (
        <div
          className="dropdown-menu sub-nav-dropdown absolute left-0 right-0 top-[64px] z-[2001]"
          style={{ backgroundColor: "rgb(26,26,26)", padding: "20px" }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="dropdown-content">
            <div className="products-grid container-lg flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {typesForCategory(openKey).map((t) => (
                <Link
                  key={t}
                  href={`/products?tab=${openKey}&type=${t}`}
                  onClick={() => setOpenKey(null)}
                  className="products-page-menu-item block px-5 py-[10px] text-center text-[16px] text-white/90 transition-colors duration-300 hover:text-saro-green-light"
                  style={{
                    fontFamily:
                      "PasticheGrotesque, Arial, sans-serif",
                  }}
                >
                  <span>{productTypeLabels[t]}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
