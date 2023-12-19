"use client";

import { useEffect, useRef, useState } from "react";
import { featureToH3Set } from "geojson2h3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { cellToBoundary } from "h3-js";
import mapboxgl from "mapbox-gl";
import rotterdamGeojson from "../static/rotterdam-geojson.json";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3dpc3NyZXBjc29sdXRpb25zIiwiYSI6ImNqemJjYzNweDAwbjczZW1va3hzdHc3bXUifQ.z-CswVAleuw64iwnZkOgzg";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(4.47917);
  const [lat, setLat] = useState(51.9225);
  const [zoom, setZoom] = useState(8);

  const [currentHexResolution, setCurrentHexResolution] = useState<number>(0);
  const [locationSourceGeoJson, setLocationSourceGeoJson] =
    useState<FeatureCollection<Geometry, GeoJsonProperties>>();

  const getGeoJsonForHexes = (
    locationHexes: string[]
  ): FeatureCollection<Geometry, GeoJsonProperties> => ({
    type: "FeatureCollection",
    features: locationHexes.map((locationHex) => ({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [cellToBoundary(locationHex, true)],
      },
    })),
  });

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    let resolution = 7;

    if (zoom > 11 && zoom <= 13) resolution = 8;
    if (zoom > 13) resolution = 9;

    if (resolution === currentHexResolution) return;

    setCurrentHexResolution(resolution);
  }, [zoom, currentHexResolution]);

  useEffect(() => {
    if (!map.current) return;

    const locationHexes: string[] = featureToH3Set(
      rotterdamGeojson as FeatureCollection<Geometry, GeoJsonProperties>,
      currentHexResolution
    );
    setLocationSourceGeoJson(() => getGeoJsonForHexes(locationHexes));
  }, [map, currentHexResolution]);

  useEffect(() => {
    if (!map.current || !locationSourceGeoJson?.features?.length) return;

    const sourceLayer = map.current.getSource("source:rotterdam");

    if (sourceLayer) {
      sourceLayer.setData(locationSourceGeoJson);
      return;
    }

    map.current.on("load", () => {
      map.current.addSource("source:rotterdam", {
        type: "geojson",
        data: locationSourceGeoJson,
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
  }, [locationSourceGeoJson]);

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
