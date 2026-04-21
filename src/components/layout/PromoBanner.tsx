import Link from "next/link";

export default function PromoBanner() {
  return (
    <Link
      href="/products"
      className="promo-banner"
      role="banner"
      aria-label="Promotional banner"
    >
      <div className="promo-banner-content">
        <span className="promo-banner-text">
          Explore our full catalog: premium WPC finishes available nationwide &nbsp;→
        </span>
      </div>
    </Link>
  );
}
