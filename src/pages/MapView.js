import React, {Component} from 'react';
import {Map, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from '../assets/data.json';
import Markers from '../components/VenueMarkers';
import Foursquare from "../utils/foursquare";
import './MapView.css';

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: {lat: 46.3, lng: 7.5333},
            zoom: 12,
        }
    }

    render() {
        const {currentLocation, zoom} = this.state;
        return (
            <>
                <div className="buttonsMap">
                    <button>Add new place</button>
                </div>
                <div className="mapTab">
                    <Foursquare className="listVenues"/>
                <Map center={currentLocation} zoom={zoom} className="mapContent">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    /> <Markers venues={data.venues}/>
                </Map>
                </div>
            </>
        );
    }
}

export default MapView;