import Link from "next/link";

export default function PromoBanner() {
  return (
    <Link
      href="/contact"
      className="promo-banner"
      role="banner"
      aria-label="Promotional banner"
    >
      <div className="promo-banner-content">
        <span className="promo-banner-text">
          30% off this month &nbsp;→
        </span>
      </div>
    </Link>
  );
}
