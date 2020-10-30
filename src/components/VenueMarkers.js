import React, {Fragment} from 'react';
import {Marker} from 'react-leaflet';
import {Icons} from './Icons';
import MarkerPopup from './MarkerPopup';

const VenueMarkers = (props) => {
    let venues = Array.from(props);

    if(venues == null){
        return;
    }

    const markers = venues.map((venue, index) => (
        <Marker
            key={index}
            //position={venue.geometry}
            position={venue.location.latitude+", "+venue.location.longitude}
            icon={Icons}
        >
            <MarkerPopup data={venue}/>
        </Marker>
    ));
    return <Fragment>{markers}</Fragment>
};
export default VenueMarkers;