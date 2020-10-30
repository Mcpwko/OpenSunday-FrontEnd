import React, {useContext, useEffect, useState} from "react";
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";

export function GetAllCategories() {
    const authContext = useContext(Auth0Context);
    const [categoriesDB, setCategoriesDB] = useState([]);

    //Get places for DB
    useEffect(() => {
        async function getCategories() {

            let categories = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.categories}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect
            );

            if (categories && categories.length > 0) {
                setCategoriesDB(categories);
            }
        }

        getCategories();

    }, []);

    return categoriesDB;
}

function GetCategories(props) {

    const categoriesDB = GetAllCategories();


    // Default - Return values/options for a select in Formik
    return (
        <>
            <option value="">Choose a category*</option>
            {categoriesDB
                .sort((a, b) => a.name > b.name ? 1 : -1)
                .map((categoryDB) => (
                    <option value={categoryDB.idCategory} key={categoryDB.idCategory}>
                        {categoryDB.name}
                    </option>
                ))}
        </>
    )


}

export default GetCategories;