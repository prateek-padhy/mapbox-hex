mapboxgl.accessToken =
  "pk.eyJ1IjoicHJhdGVlay1wYWRoeSIsImEiOiJjbHA4dXZ4MGMyam1zMmpzNHpyZjhqZjAwIn0.LeXQbR-Hgp1BJXtDGWWDUw";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [4.47917, 51.9225],
  zoom: 9,
});
