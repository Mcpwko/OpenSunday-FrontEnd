import React, {Component} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from '../assets/data.json';
import Markers from '../components/VenueMarkers';
import Foursquare from "../utils/foursquare";
import Control from '@skyeer/react-leaflet-custom-control';
import L from 'leaflet';
import "./MapView.css";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Search from "react-leaflet-search";



export const locationIcon = L.icon({
    iconUrl: require('../assets/plusIcon.png'),
    iconRetinaUrl: require('../assets/plusIcon.png'),
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [30, 35],
    className: 'leaflet-yah-icon'
});

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: {lat: 46.3, lng: 7.5333},
            marker: {lat: 46.3, lng: 7.5333},
            zoom: 12,
            draggable: true,
            viewport: {
                center: [46.3, 7.5333],
                zoom: 12,
            }
        }
        this.refMarker = React.createRef();
    }

    toggleDraggable = () => {
        this.setState({draggable: !this.state.draggable})
    }

    // Update the position of the draggable marker
    updatePosition = () => {
        const marker = this.refMarker.current
        if (marker != null) {
            this.setState({
                marker: marker.leafletElement.getLatLng()
            })
        }
    }

    render() {
        const {currentLocation, zoom, marker,viewport} = this.state;
        return (
            <>
                <div className="buttonsMap">
                    <button>Add new place</button>
                    <h1>{"Draggable -> lat:" + this.state.marker.lat + " - lng:" + this.state.marker.lng}</h1>
                </div>

                <div className="mapTab">
                    <Foursquare className="listVenues"/>
                    <Map center={currentLocation} viewport={viewport} zoom={zoom} minZoom={4} className="mapContent">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Control  position="topleft" >
                            <button
                                onClick={ () => this.setState({viewport: {
                                        center: [46.3, 7.5333],
                                        zoom: 12,
                                    }}) }
                            >
                                <FontAwesomeIcon icon={faHome} />
                            </button>
                        </Control>
                        {/*Search button that allow to find any location from leaflet */}
                        <Search position="topleft" inputPlaceholder="Search for Places, City" closeResultsOnClick={true} >
                            {(info) => (
                                <Marker icon={locationIcon} position={info?.latLng}>{<Popup>
                                    <div>
                                        <p>I am a custom popUp</p>
                                        <p>
                                            latitude and longitude from search component:{" "}
                                            {info.latLng.toString().replace(",", " , ")}
                                        </p>
                                        <p>Info from search component: {info.info}</p>
                                        <p>
                                            {info.raw &&
                                            info.raw.place_id &&
                                            JSON.stringify(info.raw.place_id)}
                                        </p>
                                    </div>
                                </Popup>}</Marker>
                            )}
                        </Search>
                        <Control position="topright"><button>Category</button></Control>
                        <Markers venues={data.venues}/>
                        <Marker
                            icon={locationIcon}
                            draggable={this.state.draggable}
                            onDragend={this.updatePosition}
                            position={marker}
                            ref={this.refMarker}
                        >
                            <Popup minWidth={90}>
                        <span onClick={this.toggleDraggable}>
                            {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
                        </span>
                            </Popup>
                        </Marker>
                    </Map>
                </div>
            </>
        );
    }
}

export default MapView;