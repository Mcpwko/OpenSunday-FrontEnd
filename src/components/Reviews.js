import React, {Fragment, useContext, useEffect, useState} from 'react';
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Auth0Context} from "@auth0/auth0-react";


function Reviews (props) {
    const [reviews, setReviews] = useState([]);
    const [idPlace, setIdPlace] = useState(props);
    const authContext = useContext(Auth0Context);

    useEffect( () => {
        async function getReviews(){
        let review = request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
            authContext.getAccessTokenSilently,
            authContext.loginWithRedirect
        );
        }

        getReviews();
    },[]);

    return <Fragment></Fragment>
};

export default Reviews;