import React, {useContext, useEffect, useState} from "react";
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";

export function GetAllPlaces() {
    const authContext = useContext(Auth0Context);
    const [places, setPlaces] = useState([]);

    //Get places for DB
    useEffect(() => {
        async function getPlaces() {

            let categories = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect
            );

            if (places && places.length > 0) {
                setPlaces(places);
            }
        }

        getPlaces();

    }, []);

    return places;
}