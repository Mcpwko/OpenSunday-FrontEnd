import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {Map, TileLayer, Marker, Popup, LayersControl, LayerGroup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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
import {BrowserRouter, Link, Route, useLocation, Router} from 'react-router-dom';
import {FiHome, FiChevronRight, FiSearch, FiSettings, FiFilter} from "react-icons/fi";
import {HereLocationIcon, PlusLocationIcon, RestaurantIconLocation} from "../components/Icons";
import styled from "styled-components";
import Details from "../components/Details";
import {useAlert} from "react-alert";
import PlacesPopup from "../components/PlacesPopup";
import MarkerClusterGroup from "react-leaflet-markercluster";
import {UserContext} from "../context/UserContext";
import Routing from "../components/RoutingMachine";

const {Overlay} = LayersControl;

export const Modal = styled.div`
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

const RoutingRoad = styled.div`
    color:black;

`;

function MapView(props) {
    // const [currentLocation, setCurrentLocation] = useState({lat: 46, lng: 7.5333});
    const [currentLocation, setCurrentLocation] = useState({lat: 46.2333, lng: 7.35});
    const [marker, setMarker] = useState({lat: 46.3, lng: 7.5333});
    const [zoom, setZoom] = useState(12);
    const [opacity, setOpacity] = useState(0);
    const [draggable, setDraggable] = useState(true);
    const [visible, setVisible] = useState(false);
    const [viewport, setViewPort] = useState({
        // center: [45.3, 7.5333],
        center: [46.2333, 7.35],
        zoom: 12,
    });
    const [types, setTypes] = useState([]);
    const [places, setPlaces] = useState([]);
    const [collapsed, setCollapsed] = useState(true);
    const [buttonGC, setButtonGC] = useState(false);
    const [selected, setSelected] = useState(0);
    const [mapInit,setMapInit] = useState(false);
    const [placeLat,setPlaceLat] = useState(0);
    const [placeLong, setPlaceLong] = useState(0);

    const [infoMarker, setInfoMarker] = useState();
    const [filter, setFilter] = useState(0);


    const refMarker = useRef();
    const refMap = useRef();
    const authContext = useAuth0();
    const userContext = useContext(UserContext);
    const alert = useAlert();

    const path = useLocation();

    useEffect(() => {
        console.log(path.pathname)
        if (path.pathname.startsWith("/map/")) {
            setVisible(true);
            console.log("PLACES : " + places);
            if (places.length > 0) {
                let place = {
                    ...places.find(
                        (place) => place.idPlace === +path.pathname.split("/").pop()
                    )
                }
                console.log("PLACES : " + place);
                if (place != null)
                    setViewPort({
                        center: [place.locationSet.lat, place.locationSet.long],
                        zoom: 15
                    })
            }
        }
    }, [path, places])

    const {
        latitude,
        longitude,
        timestamp,
        accuracy,
        error,
    } = usePosition();

    const [showHere, setShowHere] = useState(false);

    /** Show the marker of the user position */
    useEffect(() => {
        if (latitude !== undefined && longitude !== undefined) {
            setShowHere(true);
            alert.success("Your location has been successfully found !");
        }
    }, [latitude]); // Execute only if latitude has changed

    /** Tell the user to activate geolocation if he want to see himself on the map*/
    useEffect(() => {
        if (error == "User denied geolocation prompt") {
            alert.info("Activate the location in your browser to see where you are on the map");
        }
    }, [error]); // Execute only if latitude has changed


    const [data, setData] = useState({
        name: '',
        address: '',
        zip: '',
        city: ''
    })

    /** Tell the user to activate geolocation if he want to see himself on the map*/
    useEffect(() => {
        if (infoMarker !== undefined) {
            setData({
                name: infoMarker.address.amenity,
                address: infoMarker.address.road + " " + infoMarker.address.house_number,
                zip: infoMarker.address.postcode,
                city: infoMarker.address.town
            })
        }

    }, [infoMarker]); // Execute only if latitude has changed


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
            // setInfoMarker(undefined);
            setDraggable(draggable)
        }

        setShowForm(true)
    }


    const saveMap = map => {
        refMap.current = map;
        setMapInit(true);
    };

    function getRoute (placeLat,placeLong) {
        console.log("JOBTIEN DES ROUTES :");
        setPlaceLat(placeLat);
        setPlaceLong(placeLong);
        console.log(placeLat, " " , placeLong);
    }



    const closeForm = () => {
        setShowForm(false)
    }

    async function getPlaces() {

        let places = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
            authContext.getAccessTokenSilently,
            authContext.loginWithRedirect,
        );

        if (places && places.length > 0) {
            setPlaces(places);
        }
    }

    //Get places for DB
    useEffect(() => {
        getPlaces();
    }, [path]);

    useEffect(() => {
        async function getTypes() {

            let types = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.types}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect,
            );

            if (types && types.length > 0) {
                setTypes(types);
            }
        }

        getTypes();
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
    const toggleSideBar = () => {
        if (visible) {
            setVisible(false)
        } else {
            setVisible(true)
        }
    }

    const showDetails = () => {
        setVisible(true)
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

    const filterOpenSunday = (event) => {
        if (event.target.checked) {
            setFilter(1);
        } else {
            setFilter(0);
        }
    }

    const filterOpenSpecial = (event) => {
        if (event.target.checked) {
            setFilter(2);
        } else {
            setFilter(0);
        }
    }

    const icon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
    });


    return (
        <UserContext.Provider value={{user: userContext.user, refresh: userContext.refresh, refreshPlaces: getPlaces}}>
            <BrowserRouter>
                <div className="buttonsMap">
                    <button className="add" onClick={() => {
                        if (userContext.user.pseudo != null) {
                            toggleDraggable(true)
                        } else {
                            alert.error("You don't have a pseudo yet !");
                            alert.error("Please complete your profile in 'My Account' ! ");
                        }

                    }}>Add new place
                    </button>
                </div>
                <h5>{"Draggable -> lat:" + marker.lat + " - lng:" + marker.lng}</h5>

                <div className="mapTab">
                    {/*TEST DU ROUTING POUR LES PLACES*/}
                    <Route
                        path="/map/:id"
                        onEnter={showDetails}
                        render={(routeParams) => (
                            places.length > 0 ?
                                <Details
                                    {...places.find(
                                        (place) => place.idPlace === +routeParams.match.params.id
                                    )}
                                    onOpen={visible}
                                    onClose={toggleSideBar}
                                    /* Pass the new method for toggling to the Book */
                                    // toggleLike={handleToggleLike}
                                /> : null
                        )}
                    />

                    {showForm ? <Modal>
                        <span id="close" onClick={closeForm}>&times;</span>
                        {/*{console.log("LOG FORM-INFOMARKER // data ==================>" + infoMarker.address.amenity)}*/}
                        <FormPlace latitude={marker.lat} longitude={marker.lng}
                                   gcButton={buttonGC} data={data} closeForm={closeForm}/>
                    </Modal> : null}
                    {/*<Foursquare className="listVenues"/>*/}
                    <Map ref={saveMap} center={currentLocation} viewport={viewport} zoom={zoom} minZoom={4}
                         className="mapContent">
                        <LayersControl position="topright">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            />


                            {types != null ? types.map((type) => (

                                <Overlay name={type.name} key={type.idType} checked>
                                    <LayerGroup>
                                        <MarkerClusterGroup>
                                            <PlacesMarkers
                                                venues={places.filter((place) => place.typeSet.name.includes(type.name) && (filter == 1 ? place.isOpenSunday : filter == 2 ? place.isOpenSpecialDay : true))}
                                                onOpen={showDetails} select={select} getRoute={getRoute}/>
                                        </MarkerClusterGroup>
                                    </LayerGroup>
                                </Overlay>

                            )) : null}


                        </LayersControl>
                        {/* button to return to the Device Location */}
                        <Control position="topleft">
                            <button className="toolsBtn"
                                    onClick={() => setViewPort({
                                            center: [latitude, longitude],
                                            zoom: 12
                                        }
                                    )}
                                    disabled={!showHere}
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
                        <Control position="topright">
                            <div className="controlSection">
                                <label>Open on Sunday</label>
                                <input type="checkbox" onChange={filterOpenSunday}/>
                            </div>
                        </Control>
                        <Control position="topright">
                            <div className="controlSection">
                                <label>Open on Special Day</label>
                                <input type="checkbox" onChange={filterOpenSpecial}/>
                            </div>
                        </Control>
                        {/*Search button that allow to find any location from leaflet */}
                        <Search position="topleft" inputPlaceholder="Search for places, City" zoom={25}
                                closeResultsOnClick={true}>
                            {(info) => (
                                setInfoMarker(info.raw[0]),
                                    setMarker(info.latLng),
                                    // Marker to add location from search
                                    <Marker icon={PlusLocationIcon} position={info?.latLng}>{<Popup>
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
                                                    onClick={() => toggleDraggable(false)}>Add this new Place
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
                        {/*ANCIEN LISTE POUR AFFICHER LES MARKERS DE LA DB*/}
                        {/*{places === null ? null : <PlacesMarkers venues={places} onOpen={showDetails} select={select}/>}*/}

                        {/*Marker to show the location of the user*/}
                        {/*{console.log("lat:" + latitude)}*/}
                        {/*{console.log(error)}*/}
                        {showHere ? <Marker
                            icon={HereLocationIcon}
                            position={[latitude, longitude]}
                        >
                            <Popup minWidth={90}>
                                <div>
                                    <h6>You are here</h6>
                                    <span>You are not here ?</span><br/>
                                    <span>Try to reload the page.</span><br/>
                                    <button className="add" onClick={() => {
                                        window.location.reload(false)
                                    }}>
                                        Reload
                                    </button>
                                </div>
                            </Popup>
                        </Marker> : null}


                        {/**Draggable marker*/}
                        <Marker
                            icon={PlusLocationIcon}
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
                                        onClick={() => toggleDraggable(false)}>Add a new Place
                                </button>
                            </Popup>
                        </Marker>
                        <Route path="/map/:id/report">
                            <Modal>
                                <span id="close" onClick={closeForm}>&times;</span>
                                <div>WELL DONE</div>
                            </Modal>
                        </Route>
                        {(mapInit && placeLat!=0) && <RoutingRoad><Routing map={refMap.current} placeLong={placeLong} placeLat={placeLat} userLat={latitude} userLong={longitude}/></RoutingRoad>}
                    </Map>
                </div>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default MapView;