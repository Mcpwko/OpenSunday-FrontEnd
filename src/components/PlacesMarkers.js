import React, {Fragment} from 'react';
import {Marker} from 'react-leaflet';
import {switchIcon} from './Icons';
import PlacesPopup from "./PlacesPopup";

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
            <PlacesPopup data={place} onOpen={props.onOpen} select={props.select} getRoute={props.getRoute}/>
        </Marker>
    ));
    return <Fragment>{markers}</Fragment>
};
export default PlacesMarkers;