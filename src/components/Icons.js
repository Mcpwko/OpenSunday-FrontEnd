import L from 'leaflet';

// Other icons
export const HereLocationIcon = myIcon("here", 32, 35, true, "fadeIcon")
export const PlusLocationIcon = myIcon("plus", 30, 35, true)
export const UndefinedLocationIcon = myIcon("undefined", 30, 35, true)

// Places icons
export const RestaurantIconLocation = myIcon("restaurant")
export const BarLocationIcon = myIcon("bar")
export const ArtsLocationIcon = myIcon("arts")
export const HealthLocationIcon = myIcon("health")
export const FoodShopLocationIcon = myIcon("foodshop")
export const OutdoorLocationIcon = myIcon("outdoor")
export const EmergencyLocationIcon = myIcon("emergency")
export const StoreLocationIcon = myIcon("store")
export const PoliceLocationIcon = myIcon("police")
export const VeterinaryLocationIcon = myIcon("veterinary")
export const EntertainmentLocationIcon = myIcon("entertainment")

export function switchIcon(type) {
    switch (type) {
        case"Restaurant":
            return RestaurantIconLocation
        case "Bar":
            return BarLocationIcon
        case "Arts":
            return ArtsLocationIcon
        case "Health":
            return HealthLocationIcon
        case "Food shop":
            return FoodShopLocationIcon
        case "Outdoor":
            return OutdoorLocationIcon
        case "Emergency":
            return EmergencyLocationIcon
        case "Store":
            return StoreLocationIcon
        case "Police":
            return PoliceLocationIcon;
        case "Veterinary":
            return VeterinaryLocationIcon;
        case "Entertainment":
            return EntertainmentLocationIcon;
        default:
            return UndefinedLocationIcon;
    }
}

function myIcon(name, width, height, normal, cName) {

    let className = 'icon-'+name;
    let placePath = "/type"

    if(cName!=undefined){
        className=cName;
    }

    // Default width
    if (!width) {
        width = 30;
    }

    // Default height
    if (!height) {
        height = 35;
    }

    if (normal) {
        placePath = ""
    }

    return (
        L.icon({
            iconAnchor: null,
            shadowUrl: null,
            shadowSize: null,
            shadowAnchor: null,
            iconSize: [width, height],
            iconUrl: require('../assets' + placePath + '/icon-' + name + '.png'),
            iconRetinaUrl: require('../assets' + placePath + '/icon-' + name + '.png'),
            className: className,
        })
    );
}