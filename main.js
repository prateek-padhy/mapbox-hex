mapboxgl.accessToken =
  "pk.eyJ1IjoicHJhdGVlay1wYWRoeSIsImEiOiJjbHA4dXZ4MGMyam1zMmpzNHpyZjhqZjAwIn0.LeXQbR-Hgp1BJXtDGWWDUw";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [4.47917, 51.9225],
  zoom: 9,
});

map.on("load", () => {
  map.addSource("source:rotterdam", {
    type: "geojson",
    data: "rotterdam-geojson.json",
  });

  map.addLayer({
    id: "layer:rotterdam",
    type: "fill",
    source: "source:rotterdam",
    layout: {},
    paint: {
      "fill-color": "#0080ff",
      "fill-opacity": 0.5,
    },
  });

  map.addLayer({
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
