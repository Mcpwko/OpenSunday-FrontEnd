import React, { useState, useEffect } from "react";
import "./PlaceDetails.css";
import Place from "../components/Place";
import request from "../utils/request";
import { useAuth0 } from "@auth0/auth0-react";
import endpoints from "../endpoints";
import { Link } from "react-router-dom";

export default function PlaceDetails({ match }) {
  let placeID = +match.params.id;

  let [place, setPlace] = useState(null);

  let { loginWithRedirect, getAccessTokenSilently } = useAuth0();

  // Get POI details
  useEffect(() => {
    async function getLocation() {
      let place = await request(
        `${process.env.REACT_APP_SERVER_URL}${endpoints.places}/${placeID}`,
        getAccessTokenSilently,
        loginWithRedirect
      );

      setPlace(place);
    }

    getLocation();
  }, [placeID, getAccessTokenSilently, loginWithRedirect]);

  return (
    <div>
      {place ? <Place {...place} /> : <p>Loading details...</p>}
      <Link className="App-link" to="/">
        Back
      </Link>
    </div>
  );
}
