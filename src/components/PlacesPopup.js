import React, {useEffect} from 'react';
import {Popup} from 'react-leaflet';

function PlacesPopup  (props)  {
    const data = props.data;

    const handleClick = (e) => {
        e.preventDefault();
        console.log("depuis POPUP : " + data.idPlace)
        props.select(data.idPlace-1);
        props.onOpen();
    }

    return (
        <Popup>
            <h1 className='popup-text'>{data.name}</h1>
            <div>{data.locationSet.address}</div>
            <div>{data.typeSet.name && "Type : "+ data.typeSet.name}</div>
            <div>{data.categorySet.name!=null &&  "Category : " + data.categorySet.name}</div>
            <br/>
            <button className="toolsBtn" onClick={handleClick}>See more information</button>
        </Popup>
    );
};

export default PlacesPopup;