import L from 'leaflet';


export const Icons = myIcon("venue")
export const HereLocationIcon = myIcon("here", 32, 35)
export const PlusLocationIcon = myIcon("plus", 30, 35)



function myIcon(name, width, height) {

    let className = 'leaflet-' + name + '-icon';

    // Default width
    if(!width){
        width=35;
    }

    // Default height
    if(!height){
        height=35;
    }

    return (
        L.icon({
            iconAnchor: null,
            shadowUrl: null,
            shadowSize: null,
            shadowAnchor: null,
            iconSize: [width, height],
            iconUrl: require('../assets/icon-' + name + '.png'),
            iconRetinaUrl: require('../assets/icon-' + name + '.png'),
            className: className,
        })
    );
}


// export const locationIcon = L.icon({
//     iconUrl: require('../assets/icon-plus.png'),
//     iconRetinaUrl: require('../assets/icon-plus.png'),
//     iconAnchor: null,
//     shadowUrl: null,
//     shadowSize: null,
//     shadowAnchor: null,
//     iconSize: [30, 35],
//     // className: 'fadeIcon'
// });

// const Icon = {
//     iconAnchor: null,
//     shadowUrl: null,
//     shadowSize: null,
//     shadowAnchor: null,
//     iconSize: [35, 35],
// };


// export const Icons = L.icon({
//     iconUrl: require('../assets/icon-venue.png'),
//     iconRetinaUrl: require('../assets/icon-venue.png'),
//     className: 'leaflet-venue-icon',
//     ...Icon
// });

// export const ChemistLocationIcon = L.icon({
//     iconUrl: require('../assets/icon-venue.png'),
//     iconRetinaUrl: require('../assets/icon-venue.png'),
//     className: 'leaflet-venue-icon',
//     ...Icon
// });
//
// export const HereLocationIcon = L.icon({
//     iconUrl: require('../assets/PinsYouAreHere.png.png'),
//     iconRetinaUrl: require('../assets/icon-here.png'),
//     className: 'leaflet-venue-icon',
//     ...Icon
// });
//
