import React, {Fragment, useEffect} from 'react';
import {Marker, Popup} from 'react-leaflet';
import {BarLocationIcon, switchIcon} from './Icons';
import PlacesPopup from "./PlacesPopup";
import {Link} from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-markercluster";

function PlacesMarkers(props) {

    const {venues} = props;
    const markers = venues.map((place) => (
        <Marker
            key={place.idPlace}
            position={[
                place.locationSet.lat,
                place.locationSet.long
            ]}

            icon={switchIcon(place.typeSet.name)}
        >
            {/*{console.log(place.types.idType)}*/}
            {/*{console.log(place)}*/}


            <PlacesPopup data={place} onOpen={props.onOpen} select={props.select} getRoute={props.getRoute}/>
        </Marker>
    ));
    return <Fragment>{markers}</Fragment>
};
export default PlacesMarkers;