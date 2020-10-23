import React, {Fragment, useEffect} from 'react';
import {Marker} from 'react-leaflet';
import {VenueLocationIcon} from './VenueLocationIcon';
import PlacesPopup from "./PlacesPopup";

function PlacesMarkers  (props)  {

    const {venues} = props;
    const markers = venues.map((place) => (
        <Marker
            key={place.idPlace}
            position={[
                place.locationSet.lat,
                place.locationSet.long
            ]}
            icon={VenueLocationIcon}
        >
            <PlacesPopup data={place} onOpen={props.onOpen} select={props.select}/>
        </Marker>
    ));
    return <Fragment>{markers}</Fragment>
};
export default PlacesMarkers;