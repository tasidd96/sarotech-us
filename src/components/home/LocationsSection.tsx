import { locations } from "@/data/locations";

// Directions URL helper — opens Google Maps for that location
function directionsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function LocationsSection() {
  return (
    <section id="locations" className="locations-section">
      <div className="locations-container">
        {/* Header: title left, subtitle right */}
        <div className="locations-header">
          <h2 className="locations-title">Our Service Areas</h2>
          <p className="locations-subtitle">
            Headquartered in Houston, TX — serving all of greater Texas and beyond.
          </p>
        </div>

        {/* List of location rows */}
        <div className="locations-list">
          {locations.map((location) => {
            const typeLabel =
              location.id === "houston" ? "HQ · Warehouse + Office" : "Service Area";
            const directionQuery =
              location.id === "houston"
                ? "1210 Leer Street, Houston, TX"
                : `${location.city}, ${location.state}`;

            return (
              <div key={location.id} className="location-row animate-in">
                {/* 1. State / City */}
                <h3 className="location-state">{location.name}</h3>

                {/* 2. Address */}
                <p className="location-address">{location.address}</p>

                {/* 3. Type */}
                <p className="location-type">{typeLabel}</p>

                {/* 4. Directions arrow button */}
                <a
                  href={directionsUrl(directionQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-arrow"
                  aria-label={`Get directions to ${location.name}`}
                >
                  <svg
                    className="arrow-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
