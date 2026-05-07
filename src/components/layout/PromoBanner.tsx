"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Returns ms remaining until the very last second of the current
 * calendar month in the visitor's local timezone. We re-anchor on
 * every tick so the banner stays correct if the user keeps the tab
 * open across the month boundary.
 */
function msUntilEndOfMonth(now = new Date()): number {
  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
    0,
    0,
    0,
    0
  );
  return Math.max(0, startOfNextMonth.getTime() - now.getTime());
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function breakdown(ms: number): Remaining {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export default function PromoBanner() {
  // Initialize with null so server-rendered HTML doesn't include a value
  // that's stale on hydration (the timer is per-visitor and ticks every
  // second; SSR'd value would be wrong by the time it reaches the user).
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(breakdown(msUntilEndOfMonth()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Link
      href="/contact"
      className="promo-banner"
      role="banner"
      aria-label="Promotional banner"
    >
      <div className="promo-banner-content">
        <span className="promo-banner-text">
          30% off this month
          {remaining ? (
            <>
              {" → ends in "}
              <span className="promo-banner-timer tabular-nums">
                {remaining.days}d {pad(remaining.hours)}h{" "}
                {pad(remaining.minutes)}m {pad(remaining.seconds)}s
              </span>
            </>
          ) : (
            " →"
          )}
        </span>
      </div>
    </Link>
  );
}
