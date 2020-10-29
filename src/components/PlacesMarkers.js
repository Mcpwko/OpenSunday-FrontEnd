import React, {Fragment, useEffect} from 'react';
import {Marker, Popup} from 'react-leaflet';
import {Icons} from './Icons';
import PlacesPopup from "./PlacesPopup";
import {Link} from "react-router-dom";

function PlacesMarkers  (props)  {

    const {venues} = props;
    const markers = venues.map((place) => (
        <Marker
            key={place.idPlace}
            position={[
                place.locationSet.lat,
                place.locationSet.long
            ]}
            icon={Icons}
        >
            <PlacesPopup data={place} onOpen={props.onOpen} select={props.select}/>
        </Marker>
    ));
    return <Fragment>{markers}</Fragment>
};
export default PlacesMarkers;