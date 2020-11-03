import React, {useState} from "react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
// import Link from "@material-ui/core/Link";
import GetTypes from "../database/GetTypes";
import GetCategories from "../database/GetCategories";
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";

export default function Places(props) {
    //List of all places
    let [locations, setLocations] = useState([]);

    //Variables for Auth0
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
        user,
    } = useAuth0();

    //Handle click for "Get Locations" button
    let handleLocationsClick = async (e) => {
        e.preventDefault();
        let locations = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
            getAccessTokenSilently,
            loginWithRedirect
        );


        if (locations && locations.length > 0) {
            console.log(locations);
            setLocations(locations);
        }
    };

    return (
        <div className="place">
            <div className="filters"></div>
            <select>
                {GetTypes()}
            </select>
            <select>
                {GetCategories()}
            </select>

            <div className="buttonsMap">
                <button className="add" onClick={handleLocationsClick}>Get places</button>
            </div>

            {/*<a*/}
            {/*    className="App-link"*/}
            {/*    href="#"*/}
            {/*    onClick={handleLocationsClick}*/}
            {/*>*/}
            {/*    Get Locations*/}
            {/*</a>*/}
            {locations && locations.length > 0 && (
                <ul className="Locations-List">
                    {locations.map((location) => (
                        <li key={location.id}>
                            <Link
                                className="App-link"
                                to={`/location/${location.id}`}
                            >
                                {location.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}