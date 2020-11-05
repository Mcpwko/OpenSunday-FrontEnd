import React from 'react';
import {Popup} from 'react-leaflet';
import {Link} from "react-router-dom";
import {faRoute} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function PlacesPopup(props) {
    const data = props.data;

    const getRouting = (placeLat, placeLong) => {
        props.getRoute(placeLat, placeLong);
    }

    return (
        <Popup>
            <h1 className='popup-text'>{data.name}</h1>
            <div>{data.locationSet.address}</div>
            <div>{data.typeSet.name && "Type : " + data.typeSet.name}</div>
            <div>{data.categorySet.name != null && "Category : " + data.categorySet.name}</div>
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
            <button
                className="toolsBtn"
                style={{margin: "20px"}}
                onClick={() => getRouting(data.locationSet.lat, data.locationSet.long)}
            >
                <FontAwesomeIcon icon={faRoute}/>
            </button>

        </Popup>
    );
};

export default PlacesPopup;