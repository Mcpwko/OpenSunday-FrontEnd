import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: { lat: 46.3, lng: 7.5333 },
            zoom: 12,
        }
    }
    render() {
        const { currentLocation, zoom } = this.state;
        return (
            <Map center={currentLocation} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
            </Map>
        );
    }
}
export default MapView;