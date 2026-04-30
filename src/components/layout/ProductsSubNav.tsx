"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProductCategory, ProductType } from "@/lib/types";
import { productTypeLabels } from "@/data/products";

type MenuKey = ProductCategory;

type Props = {
  /**
   * Map of category → product types that have at least one visible product.
   * Categories absent from the map are hidden entirely. Types are filtered
   * to only those actually represented in the live catalog.
   */
  typesByCategory: Partial<Record<ProductCategory, ProductType[]>>;
};

const ALL_MENU_ITEMS: { key: MenuKey; desktop: string; mobile: string }[] = [
  { key: "interior", desktop: "INTERIOR PRODUCTS", mobile: "INTERIOR" },
  { key: "exterior", desktop: "EXTERIOR PRODUCTS", mobile: "EXTERIOR" },
  { key: "accessories", desktop: "ACCESSORIES", mobile: "ACCESSORIES" },
];

export default function ProductsSubNav({ typesByCategory }: Props) {
  const [openKey, setOpenKey] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read current filter state from the URL so menu items / dropdown
  // entries can show "active" highlighting that matches the listing.
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<MenuKey | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());

  // Re-read URL when it changes — covers initial mount, Next nav, AND
  // the synthetic popstate event ProductsPageClient fires after it
  // calls history.replaceState (since replaceState alone doesn't notify
  // listeners).
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as MenuKey | null;
      setActiveTab(tab && ALL_MENU_ITEMS.some((m) => m.key === tab) ? tab : null);
      setActiveTypes(new Set(params.getAll("type")));
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
    // pathname + searchParams in deps so Next client navs (Link clicks) re-sync.
  }, [pathname, searchParams]);

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

  const visibleMenuItems = ALL_MENU_ITEMS.filter(
    (item) => (typesByCategory[item.key]?.length ?? 0) > 0
  );

  // No populated categories at all — hide the entire sub-nav.
  if (visibleMenuItems.length === 0) return null;

  return (
    <div
      className="products-menu-container white-menu relative"
      style={{ backgroundColor: "rgb(26,26,26)", height: "64px" }}
      onMouseLeave={scheduleClose}
    >
      <nav className="products-main-menu container-lg flex h-[64px] items-center justify-center">
        {visibleMenuItems.map((item) => {
          const isOpen = openKey === item.key;
          // A menu item is "active" if the user is on its tab OR if any of
          // its product types are selected — so picking Floor Decking from
          // the sidebar (no tab in URL) still lights up EXTERIOR PRODUCTS.
          const itemTypes = typesByCategory[item.key] ?? [];
          const isActive =
            activeTab === item.key || itemTypes.some((t) => activeTypes.has(t));
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
                  color: isActive ? "#74c69d" : "#ffffff",
                  borderBottom: isActive
                    ? "2px solid #74c69d"
                    : "2px solid transparent",
                  fontFamily:
                    "PasticheGrotesque, Arial, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  lineHeight: "24px",
                  textTransform: "uppercase",
                  transition: "color 0.3s, border-color 0.3s",
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
      {openKey && (typesByCategory[openKey]?.length ?? 0) > 0 && (
        <div
          className="dropdown-menu sub-nav-dropdown absolute left-0 right-0 top-[64px] z-[2001]"
          style={{ backgroundColor: "rgb(26,26,26)", padding: "20px" }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="dropdown-content">
            <div className="products-grid container-lg flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {(typesByCategory[openKey] ?? []).map((t) => {
                // Highlight a type whenever it's selected, regardless of
                // whether the URL has a `tab=` set. (User may pick the
                // type from the sidebar without picking a category first.)
                const isTypeActive = activeTypes.has(t);
                return (
                  <Link
                    key={t}
                    href={`/products?tab=${openKey}&type=${t}`}
                    onClick={() => setOpenKey(null)}
                    className="products-page-menu-item block px-5 py-[10px] text-center text-[16px] transition-colors duration-300 hover:text-saro-green-light"
                    style={{
                      color: isTypeActive ? "#74c69d" : "rgba(255,255,255,0.9)",
                      fontWeight: isTypeActive ? 600 : 400,
                      fontFamily:
                        "PasticheGrotesque, Arial, sans-serif",
                    }}
                  >
                    <span>{productTypeLabels[t]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
