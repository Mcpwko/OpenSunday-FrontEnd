import React from 'react';
import {Popup} from 'react-leaflet';

const PlacesPopup = (props) => {
    const data = props.data;
    return (
        <Popup>
            <h1 className='popup-text'>{data.name}</h1>
            <div>{data.locationSet.address}</div>
            <div>{data.typeSet.name && "Type : "+ data.typeSet.name}</div>
            <div>{data.categorySet.name!=null &&  "Category : " + data.categorySet.name}</div>
            <br/>
            <button className="toolsBtn" onClick={props.setVisible}>See more information</button>
        </Popup>
    );
};

export default PlacesPopup;