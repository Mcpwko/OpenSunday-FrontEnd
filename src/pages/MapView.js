import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from '../assets/data.json';
import Markers from '../components/VenueMarkers';
import Foursquare from "../utils/foursquare";
import Control from '@skyeer/react-leaflet-custom-control';
import L from 'leaflet';
import "./MapView.css";
import {faHome, faMapMarkerAlt, faSearch, faWindowClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Search from "react-leaflet-search";
import {usePosition} from 'use-position';
import {FormPlace} from "../components/FormPlace";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import PlacesMarkers from '../components/PlacesMarkers';
import {Link} from "react-router-dom";
import {Sidebar, Tab} from "react-leaflet-sidetabs";
import {FiHome, FiChevronRight, FiSearch, FiSettings, FiFilter} from "react-icons/fi";
import {VenueLocationIcon} from "../components/VenueLocationIcon";
import PlacesPopup from "../components/PlacesPopup";
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
    const [selected , setSelected] = useState(0);

    const refMarker = useRef();
    const refMap = useRef();

    const {
        latitude,
        longitude,
        timestamp,
        accuracy,
        error,
    } = usePosition();


    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
        user,
    } = useAuth0();

    const onClose = () => {
        setCollapsed(true);
    }
    const onOpen = (id) => {
        setCollapsed( false);
        setSelected(id);
    }


    const toggleDraggable = (props) => {
        setShowLatLong(props)

        // In case of draggable marker
        if (opacity === 1) {
            setDraggable(!draggable)
        }

        setShowForm(true)
    }


    const closeForm = () => {
        setShowForm(false)
    }

    useEffect(() => {
        async function getPlaces() {

            let places = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            // console.log(places);
            // places.map((place) => (
            //     console.log(place.locationSet.lat)
            // ))

            if (places && places.length > 0) {
                // console.log(places);
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

    const showDetails = () => {
        if(visible){
        setVisible(false)
        }
        else{
            setVisible(true)
        }
    }

    const select = (info) => {
        setSelected(info)
    }


    // const map = refMap.current.leafletElement;
    //refMap.current.addControl(sidebar);

    const setDraggableMarker = () => {
        if (opacity === 0) {
            setOpacity(1)
        } else {
            setOpacity(0)
        }
        getMapCenter();
    }

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
                <button onClick={() => toggleDraggable(false)}>Add new place</button>
            </div>
            <h1>{"Draggable -> lat:" + marker.lat + " - lng:" + marker.lng}</h1>

            <div className="mapTab">
                {/*{showForm ? <FormPlace latitude={marker.lat} longitude={marker.lng}/> : null}*/}
                {/*<Foursquare className="listVenues"/>*/}

                {visible && <div className="listVenues">
                    <h1>{console.log("SALUT " + selected)}{places[selected].name}</h1>
                    <ul>
                        {places!=null && places.map((place, index) => (
                                <li key={index}>
                                    {place.name}
                                </li>
                            ))}
                    </ul>
                </div>}

                {showForm ? <Modal>
                    <span id="close" onClick={closeForm}>&times;</span>
                    <FormPlace latitude={marker.lat} longitude={marker.lng} show={showLatLong}/>
                </Modal> : null}
                {/*<Foursquare className="listVenues"/>*/}
                <Map ref={refMap} center={currentLocation} viewport={viewport} zoom={zoom} minZoom={4}
                     className="mapContent">
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
                            <button style={{marginLeft: 10}} className="toolsBtn" onClick={() => toggleDraggable(false)}>ADD ME
                            </button>
                        </Popup>
                    </Marker>
                    {/*<Sidebar*/}
                    {/*    id="sidebar"*/}
                    {/*    position="right"*/}
                    {/*    collapsed={collapsed}*/}
                    {/*    closeIcon={<FiChevronRight />}*/}
                    {/*    selected={selected}*/}
                    {/*    onOpen={onOpen}*/}
                    {/*    onClose={onClose}*/}
                    {/*    style={{height:20}}*/}
                    {/*>*/}
                    {/*    <Tab id="home" header="Home" icon={<FiHome />}>*/}
                    {/*        <p>Salut</p>*/}
                    {/*    </Tab>*/}
                    {/*    <Tab id="filter" header="Filter" icon={<FiFilter/>}>*/}
                    {/*        <p>Filters Category</p>*/}
                    {/*    </Tab>*/}
                    {/*    <Tab id="select" header="Select" icon={<FiFilter/>}>*/}
                    {/*        <p>Filters Category</p>*/}
                    {/*    </Tab>*/}
                    {/*</Sidebar>*/}
                </Map>
            </div>
        </>
    );
}

export default MapView;