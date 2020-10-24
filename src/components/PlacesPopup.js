import React, {useEffect} from 'react';
import {Popup} from 'react-leaflet';
import {Link} from "react-router-dom";

function PlacesPopup  (props)  {
    const data = props.data;


    return (
        <Popup>
            <h1 className='popup-text'>{data.name}</h1>
            <div>{data.locationSet.address}</div>
            <div>{data.typeSet.name && "Type : "+ data.typeSet.name}</div>
            <div>{data.categorySet.name!=null &&  "Category : " + data.categorySet.name}</div>
            <br/>
            <button className="toolsBtn">
                <Link
                    className="btn toolsBtn"
                    onClick={props.onOpen}
                    to={`/map/${data.idPlace}`}
                    className="App-link">
                    See more information
                </Link>
            </button>

        </Popup>
    );
};

export default PlacesPopup;