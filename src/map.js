const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.marker([37.7749, -122.4194])
  .addTo(map)
  .bindPopup("A popular study spot!")
  .openPopup();

var marker = L.marker([51.5, -0.09]).addTo(map);

var popup = L.popup()
  .setLatLng([51.513, -0.09])
  .setContent("I am a standalone popup.")
  .openOn(map);

function onMapClick(e) {
  // const newMarker = L.marker(e.latlng).addTo(map);
  // newMarker.bindPopup("New study spot at " + e.latlng.toString()).openPopup();

  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

// Event listener for map clicks
map.on("click", onMapClick);
