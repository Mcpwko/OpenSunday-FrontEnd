import L from 'leaflet';

export const VenueLocationIcon = L.icon({
    iconUrl: require('../assets/icon-restaurant.png'),
    iconRetinaUrl: require('../assets/icon-restaurant.png'),
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [35, 35],
    className: 'leaflet-venue-icon'
});