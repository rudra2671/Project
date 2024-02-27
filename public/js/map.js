// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     container: 'map', 
//     style: "mapbox://styles/mapbox/streets-v12", 
//     center: [77.209, 28.6139],
//     zoom: 9 ,
// });

mapboxgl.accessToken = mapToken;

console.log("Listing Coordinates:", listing.geometry.coordinates); // Log the coordinates

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: listing.geometry.coordinates, // New center coordinates [longitude, latitude]
    zoom: 9, // Adjust the zoom level as needed
});

console.log("Listing Coordinates after map initialization:", listing.geometry.coordinates);

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${listing.location}</h4> <p>Exact Location will be provided after booking </p>`
        )
    )
    .addTo(map);

console.log("Marker added with coordinates:", listing.geometry.coordinates);
