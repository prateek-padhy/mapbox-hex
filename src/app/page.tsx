"use client";

import { useEffect, useRef, useState } from "react";
import rotterdamGeojson from "../static/rotterdam-geojson.json";

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3dpc3NyZXBjc29sdXRpb25zIiwiYSI6ImNqemJjYzNweDAwbjczZW1va3hzdHc3bXUifQ.z-CswVAleuw64iwnZkOgzg";

export default function Home() {
  const mapContainer = useRef(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(4.47917);
  const [lat, setLat] = useState(51.9225);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    if (!map.current) return;

    map.current.on("load", () => {
      map.current.addSource("source:rotterdam", {
        type: "geojson",
        data: rotterdamGeojson,
      });

      map.current.addLayer({
        id: "layer:rotterdam",
        type: "fill",
        source: "source:rotterdam",
        layout: {},
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.5,
        },
      });

      map.current.addLayer({
        id: "outline:rotterdam",
        type: "line",
        source: "source:rotterdam",
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 0.25,
        },
      });
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <main id="map">
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: "100vh" }}
      />
    </main>
  );
}
