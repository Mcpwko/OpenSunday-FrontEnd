import React, {useRef, useState} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from '../assets/data.json';
import Markers from '../components/VenueMarkers';
import Foursquare from "../utils/foursquare";
import Control from '@skyeer/react-leaflet-custom-control';
import L from 'leaflet';
import "./MapView.css";
import {faHome} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Search from "react-leaflet-search";
import {usePosition} from 'use-position';


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

function MapView(props) {


    const [currentLocation, setCurrentLocation] = useState({lat: 46, lng: 7.5333});
    const [marker, setMarker] = useState({lat: 46.3, lng: 7.5333});
    const [zoom, setZoom] = useState(12);
    const [draggable, setDraggable] = useState(true);
    const [viewport, setViewPort] = useState({
        center: [45.3, 7.5333],
        zoom: 12,
    });
    const refMarker = useRef();

    const {
        latitude,
        longitude,
        timestamp,
        accuracy,
        error,
    } = usePosition();


    const toggleDraggable = () => {
        setDraggable(!draggable)
    }

    // Update the position of the draggable marker
    const updatePosition = () => {
        const marker = refMarker.current
        if (marker != null) {
            setMarker(
                marker.leafletElement.getLatLng()
            )
        }
    }

    return (
        <>
            <div className="buttonsMap">
                <button>Add new place</button>
                <h1>{"Draggable -> lat:" + marker.lat + " - lng:" + marker.lng}</h1>
            </div>

            <div className="mapTab">
                <Foursquare className="listVenues"/>
                <Map center={currentLocation} viewport={viewport} zoom={zoom} minZoom={4} className="mapContent">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Control position="topleft">
                        <button className="toolsBtn"
                                onClick={() => setViewPort({
                                    center: [latitude, longitude],
                                    zoom: 12,
                                })}
                        >
                            <FontAwesomeIcon icon={faHome}/>
                        </button>
                    </Control>
                    {/*Search button that allow to find any location from leaflet */}
                    <Search position="topleft" inputPlaceholder="Search for Places, City" zoom={25}
                            closeResultsOnClick={true}>
                        {(info) => (
                            <Marker icon={locationIcon} position={info?.latLng}>{<Popup>
                                <div>
                                    <h1>{info.raw[0].address.amenity}</h1>
                                    <h2>{info.raw[0].type}</h2>
                                    <p>{info.raw[0].address.road} {info.raw[0].address.house_number}</p>
                                    <p>{info.raw[0].address.state}</p>
                                    <p>{info.raw[0].address.postcode} {info.raw[0].address.town}</p>
                                    <p>
                                        {info.latLng.toString().replace(",", " , ")}
                                    </p>
                                    <p>Info from search component:{info.info}</p>
                                    <p>
                                        {info.raw &&
                                        info.raw.place_id &&
                                        JSON.stringify(info.raw.place_id)}
                                    </p>
                                </div>
                            </Popup>}</Marker>
                        )}
                    </Search>
                    <Control position="topright">
                        <button>Category</button>
                    </Control>
                    <Markers venues={data.venues}/>
                    <Marker
                        icon={locationIcon}
                        draggable={draggable}
                        onDragend={updatePosition}
                        position={marker}
                        ref={refMarker}
                    >
                        <Popup minWidth={90}>
                        <span onClick={toggleDraggable}>
                            {draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
                        </span>
                        </Popup>
                    </Marker>
                </Map>
            </div>
        </>
    );
}

export default MapView;