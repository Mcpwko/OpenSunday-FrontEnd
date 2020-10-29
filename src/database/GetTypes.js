import React, {useContext, useEffect, useState} from "react";
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";

export function GetAllTypes() {
    const authContext = useContext(Auth0Context);
    const [typesDB, setTypesDB] = useState([]);

    //Get types from DB
    useEffect(() => {
        async function getTypes() {

            let types = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.types}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect
            );

            if (types && types.length > 0) {
                setTypesDB(types);
            }
        }

        getTypes();

    }, []);

    return typesDB;
}

function GetTypes() {

    const typesDB = GetAllTypes();

    // Default - Return values/options for a select in Formik
    return (
        <>
            <option value="">Choose a type*</option>
            {typesDB
                .sort((a, b) => a.name > b.name ? 1 : -1)
                .map((typeDB) => (
                    <option value={typeDB.idType} key={typeDB.idType}>
                        {typeDB.name}
                    </option>
                ))}
        </>
    )

}

export default GetTypes;

