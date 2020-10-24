import React, {useContext, useEffect, useState} from "react";
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";

export function GetAllRegions() {
    const authContext = useContext(Auth0Context);
    const [regionsDB, setRegionsDB] = useState([]);

    //Get places for DB
    useEffect(() => {
        async function getRegions() {

            let regions = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.regions}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect
            );

            if (regions && regions.length > 0) {
                setRegionsDB(regions);
            }
        }

        getRegions();

    }, []);

    return regionsDB;
}

function GetRegions(props) {

    const regionsDB = GetAllRegions();

    // Default - Return values/options for a select in Formik
    return (
        <>
            <option>Choose a region</option>
            {regionsDB.map((regionDB) => (
                <option value={regionDB.idRegion} key={regionDB.idRegion}>
                    {regionDB.name}
                </option>
            ))}
        </>
    )


}

export default GetRegions;