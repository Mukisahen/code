// Shared Leaflet helper for plotting vehicle/student GPS points.
// Requires leaflet.js/leaflet.css to already be loaded on the page.

const SECURE_EYE_MAP_CENTER = [0.4021, 32.6610]; // Berecah Primary School, Kiira Municipality, Wakiso District

function createFleetMap(elementId) {
  const map = L.map(elementId).setView(SECURE_EYE_MAP_CENTER, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  const markers = new Map();

  return {
    map,
    upsertMarker(key, lat, lng, label) {
      if (lat == null || lng == null) return;
      const latLng = [Number(lat), Number(lng)];
      if (markers.has(key)) {
        markers.get(key).setLatLng(latLng).bindPopup(label);
      } else {
        markers.set(key, L.marker(latLng).addTo(map).bindPopup(label));
      }
    },
    removeStale(activeKeys) {
      for (const key of markers.keys()) {
        if (!activeKeys.has(key)) {
          map.removeLayer(markers.get(key));
          markers.delete(key);
        }
      }
    },
    fitToMarkers() {
      if (markers.size === 0) return;
      const group = L.featureGroup(Array.from(markers.values()));
      map.fitBounds(group.getBounds().pad(0.2));
    },
  };
}
