"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="map-shell">
      <div className="map-canvas h-[65vh] w-full animate-pulse bg-[color:var(--bg-terminal-dark)]" />
    </div>
  )
});

export default MapView;
