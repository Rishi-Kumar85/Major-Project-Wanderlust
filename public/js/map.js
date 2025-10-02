document.addEventListener('DOMContentLoaded', () => {
  if (Array.isArray(listingCoords) && listingCoords.length === 2) {
    const [lng, lat] = listingCoords;

    const map = L.map('map').setView([lat, lng], 13); // Zoom 13 for better focus

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://png.pngtree.com/png-clipart/20250303/original/pngtree-3d-map-location-marker-icon-in-red-png-image_20556801.png',
      iconSize: [40, 65],
      iconAnchor: [20, 65],
      popupAnchor: [0, -60],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [65, 65]
    });

    const popupContent = `
      <div style="text-align:center;">
        <h4>${listingTitle}</h4>
        <p>${listingLocation}</p>
      </div>
    `;

    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent)
      .openPopup();
  } else {
    console.warn("Invalid or missing coordinates for listing.");
  }
});