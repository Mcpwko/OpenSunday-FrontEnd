import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from '../assets/data.json';
import Markers from '../components/VenueMarkers';
import Foursquare from "../utils/foursquare";
import Control from '@skyeer/react-leaflet-custom-control';
import L from 'leaflet';
import "./MapView.css";
import {
    faCertificate, faCheckCircle,
    faCross, faEdit,
    faHome,
    faMapMarkerAlt,
    faSearch,
    faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Search from "react-leaflet-search";
import {usePosition} from 'use-position';
import {FormPlace} from "../components/FormPlace";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Auth0Context, useAuth0} from "@auth0/auth0-react";
import PlacesMarkers from '../components/PlacesMarkers';
import {Link} from "react-router-dom";
import {FiHome, FiChevronRight, FiSearch, FiSettings, FiFilter} from "react-icons/fi";
import {VenueLocationIcon} from "../components/VenueLocationIcon";
import styled from "styled-components";

export const locationIcon = L.icon({
    iconUrl: require('../assets/plusIcon.png'),
    iconRetinaUrl: require('../assets/plusIcon.png'),
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [30, 35],
    // className: 'fadeIcon'
});

const Modal = styled.div`
    // display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 10000; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
`;

function MapView(props) {
    const [currentLocation, setCurrentLocation] = useState({lat: 46, lng: 7.5333});
    const [marker, setMarker] = useState({lat: 46.3, lng: 7.5333});
    const [zoom, setZoom] = useState(12);
    const [opacity, setOpacity] = useState(0);
    const [draggable, setDraggable] = useState(true);
    const [visible, setVisible] = useState(false);
    const [viewport, setViewPort] = useState({
        center: [45.3, 7.5333],
        zoom: 12,
    });
    const [places, setPlaces] = useState([]);
    const [collapsed, setCollapsed] = useState(true);
    const [buttonGC, setButtonGC] = useState(false);
    const [selected, setSelected] = useState(0);

    const refMarker = useRef();
    const refMap = useRef();
    const authContext = useContext(Auth0Context);

    const {
        latitude,
        longitude,
        timestamp,
        accuracy,
        error,
    } = usePosition();


    const toggleDraggable = (props) => {

        // If it is a manually entry reset value of lat and long
        if (props) {
            setMarker({lat: 0, lng: 0});
            setButtonGC(true);
        } else {
            setButtonGC(false);
        }


        // In case of draggable marker
        if (opacity === 1) {
            setDraggable(!draggable)
        }

        setShowForm(true)
    }


    const closeForm = () => {
        setShowForm(false)
    }
    //Get places for DB
    useEffect(() => {
        async function getPlaces() {

            let places = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
                authContext.getAccessTokenSilently,
            );

            if (places && places.length > 0) {
                setPlaces(places);
            }
        }

        getPlaces();
    }, []);

    // Update the position of the draggable marker
    const updatePosition = () => {
        const marker = refMarker.current
        if (marker != null) {
            setMarker(
                marker.leafletElement.getLatLng()
            )
        }
    }
    //Display the sidebar where are the information of a specific Place
    const showDetails = () => {
        if (visible) {
            setVisible(false)
        } else {
            setVisible(true)
        }
    }
    //Indicate which place has been selected
    const select = (info) => {
        setSelected(info)
    }

    //Show Draggable Marker
    const setDraggableMarker = () => {
        if (opacity === 0) {
            setOpacity(1)
        } else {
            setOpacity(0)
        }
        getMapCenter();
    }

    //Get middle position of the visible map
    const getMapCenter = () => {
        const center = refMap.current;
        // console.log(center.leafletElement.getCenter().toString());
        setMarker(center.leafletElement.getCenter())
    }

    const [showForm, setShowForm] = useState(false);
    const [showLatLong, setShowLatLong] = useState(false);

    // const toggleCoordinates = (props) => {
    //     setShowLatLong(props)
    //
    //     if(showLatLong){
    //
    //     }
    //     else{
    //
    //     }
    //
    //     toggleDraggable()
    // }

    // const displayForm = () => {
    //     setShowForm(true)
    // }

    const refresh = () => {
        setTimeout(function () {
            setZoom(25);
        }, 100)
    }


    return (
        <>
            <div className="buttonsMap">
                <button onClick={() => toggleDraggable(true)}>Add new place</button>
            </div>
            <h1>{"Draggable -> lat:" + marker.lat + " - lng:" + marker.lng}</h1>

            <div className="mapTab">
                {/*Sidebar with information about the place which has been selected*/}
                <div  className={`listVenues ${visible ? "in" : ""}`} >
                    {visible &&
                        <>
                            <button className="toolsBtn" onClick={showDetails}>
                                <span>❌</span>
                            </button>
                            <h1>{places[selected].name} {places[selected].isVerified ?
                                <FontAwesomeIcon icon={faCheckCircle}/> :
                                <button>
                                    <FontAwesomeIcon icon={faEdit}/>
                                </button>}
                            </h1>

                            <h2>{places[selected].categorySet.name}</h2>
                            <h2>{places[selected].typeSet.name}</h2>
                            <p>
                                Open on sundays : {
                                places[selected].isOpenSunday ?
                                    <span>✔</span> : <span>❌</span>
                            }
                            </p>
                            <p>
                                Open on Special Days : {
                                places[selected].isOpenSpecialDay ?
                                    <span>✔</span> : <span>❌</span>
                            }
                            </p>
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{align:"center"}}>{places[selected].description}</td>
                                    </tr>
                                    <tr>
                                        <td>{places[selected].locationSet.address}</td>
                                    </tr>
                                    <tr>
                                        <td>{places[selected].locationSet.regionSet.name}</td>
                                    </tr>
                                    <tr>
                                        <td>{places[selected].locationSet.citySet.name}</td>
                                    </tr>
                                    <tr>
                                        <td>{places[selected].email}</td>
                                    </tr>
                                    <tr>
                                        <td>{places[selected].website}</td>
                                    </tr>
                                    <tr>
                                        <td>{places[selected].phoneNumber}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br/>
                            <h1>Reviews</h1>
                    </>}
                </div>

                {showForm ? <Modal>
                    <span id="close" onClick={closeForm}>&times;</span>
                    <FormPlace latitude={marker.lat} longitude={marker.lng} gcButton={buttonGC}/>
                </Modal> : null}
                {/*<Foursquare className="listVenues"/>*/}
                <Map ref={refMap} center={currentLocation} viewport={viewport} zoom={zoom} minZoom={4}
                     className="mapContent">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {/* button to return to the Device Location */}
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
                    {/* button to add a new Marker on the map*/}
                    <Control position="topleft">
                        <button className="toolsBtn"
                                onClick={setDraggableMarker}
                        >
                            <FontAwesomeIcon size={"lg"} icon={faMapMarkerAlt}/>
                        </button>
                    </Control>
                    {/*Search button that allow to find any location from leaflet */}
                    <Search position="topleft" inputPlaceholder="Search for places, City" zoom={25}
                            closeResultsOnClick={true}>
                        {(info) => (
                            setMarker(info.latLng),
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
                                        <br/>
                                        <button style={{marginLeft: 10}} className="toolsBtn"
                                                onClick={() => toggleDraggable(false)}>ADD ME
                                        </button>
                                    </div>
                                    {/*****/}
                                    {/*Actualise the map*/}
                                    {/*****/}
                                    {
                                        setTimeout(function () {
                                            setZoom(25);
                                        }, 100)
                                    }
                                </Popup>}</Marker>
                        )}

                    </Search>
                    <Markers venues={data.venues}/>
                    {places === null ? null : <PlacesMarkers venues={places} onOpen={showDetails} select={select}/>}
                    <Marker
                        icon={locationIcon}
                        draggable={draggable}
                        onDragend={updatePosition}
                        position={marker}
                        ref={refMarker}
                        opacity={opacity}
                    >
                        <Popup minWidth={90}>
                        <span onClick={toggleDraggable}>
                            {draggable ? 'Create place' : "Complete the form"}
                        </span>
                            <br/>
                            <button style={{marginLeft: 10}} className="toolsBtn"
                                    onClick={() => toggleDraggable(false)}>ADD ME
                            </button>
                        </Popup>
                    </Marker>
                </Map>
            </div>
        </>
    );
}

export default MapView;