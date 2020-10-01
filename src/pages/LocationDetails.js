import React, { useState, useEffect } from "react";
import "./LocationDetails.css";
import Location from "../components/Location";
import request from "../utils/request";
import { useAuth0 } from "@auth0/auth0-react";
import endpoints from "../endpoints";
import { Link } from "react-router-dom";

export default function LocationDetails({ match }) {
  let locationID = +match.params.id;

  let [location, setLocation] = useState(null);

  let { loginWithRedirect, getAccessTokenSilently } = useAuth0();

  // Get POI details
  useEffect(() => {
    async function getLocation() {
      let location = await request(
        `${process.env.REACT_APP_SERVER_URL}${endpoints.locations}/${locationID}`,
        getAccessTokenSilently,
        loginWithRedirect
      );

      setLocation(location);
    }

    getLocation();
  }, [locationID, getAccessTokenSilently, loginWithRedirect]);

  return (
    <div>
      {location ? <Location {...location} /> : <p>Loading details...</p>}
      <Link className="App-link" to="/">
        Back
      </Link>
    </div>
  );
}
