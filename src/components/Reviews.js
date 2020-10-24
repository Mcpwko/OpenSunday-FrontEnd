import React, {Fragment, useContext, useEffect, useState} from 'react';
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Auth0Context} from "@auth0/auth0-react";
import {Marker} from "react-leaflet";
import {VenueLocationIcon} from "./VenueLocationIcon";
import PlacesPopup from "./PlacesPopup";
import Rating from "@material-ui/lab/Rating";


function Reviews (props) {
    const [reviews, setReviews] = useState([]);
    const authContext = useContext(Auth0Context);
    const idPlace = props.idPlace;

    useEffect( () => {
        async function getReviews(){
                let review = await request(
                    `${process.env.REACT_APP_SERVER_URL}${endpoints.review}${ props.idPlace}`,
                    authContext.getAccessTokenSilently,
                    authContext.loginWithRedirect
                );
        if(review!=null){
            setReviews(review);
        }
        }
        getReviews();
    },[reviews]);

    return(
            <div>
                <ul>
                {reviews.map((review) => (
                    <li key={review.idReview}>
                    <h3>{review.userSet.idAuth0}</h3>
                        <p>{review.rate}</p>
                        <Rating name="simple-controlled" value={review.rate}  readOnly/>
                    <p>
                        {review.comment}
                    </p>
                    </li>
                ))}
                </ul>
            </div>
    )
};

export default Reviews;