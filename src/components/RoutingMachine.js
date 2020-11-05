import { MapLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { withLeaflet } from "react-leaflet";

class Routing extends MapLayer {



    createLeafletElement(props) {
        const { map } = this.props;
        let leafletElement = L.Routing.control({
            waypoints: [L.latLng(this.props.userLat, this.props.userLong), L.latLng(this.props.placeLat, this.props.placeLong)]
        }).addTo(map.leafletElement);
        return leafletElement.getPlan();
    }
}
export default withLeaflet(Routing);