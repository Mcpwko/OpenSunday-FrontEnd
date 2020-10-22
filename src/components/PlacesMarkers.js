import React, {Fragment} from 'react';
import {Marker} from 'react-leaflet';
import {VenueLocationIcon} from './VenueLocationIcon';
import PlacesPopup from "./PlacesPopup";

const PlacesMarkers = (props) => {
    const {venues} = props;
    const markers = venues.map((place, index) => (
        <Marker
            key={index}
            position={[
                place.locationSet.lat,
                place.locationSet.long
            ]}
            icon={VenueLocationIcon}
        >
            <PlacesPopup data={place} onOpen={props.setVisible}/>
        </Marker>
    ));
    return <Fragment>{markers}</Fragment>
};
export default PlacesMarkers;