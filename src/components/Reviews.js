import React, {Fragment, useContext, useEffect, useState} from 'react';
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Auth0Context} from "@auth0/auth0-react";
import {Marker} from "react-leaflet";
import PlacesPopup from "./PlacesPopup";
import Rating from "@material-ui/lab/Rating";
import {FormPlace} from "./FormPlace";
import {FormReview} from "./FormReview";


function Reviews (props) {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const authContext = useContext(Auth0Context);
    const idPlace = props.idPlace;

    useEffect( () => {
        async function getReviews(){
                let review = await request(
                    `${process.env.REACT_APP_SERVER_URL}${endpoints.review}${ props.idPlace}`,
                    authContext.getAccessTokenSilently
                );
        if(review!=null){
            setReviews(review);
        }
        }
        getReviews();
    },[props.idPlace]);


    const showReviewForm = (props) => {


        setShowForm(true)
    }


    const closeForm = () => {
        setShowForm(false)
    }



    return(
            <div>
                <ul style={{listStyleType: "none", padding: "0", margin:"0"}}>
                {reviews!=null ? reviews.map((review) => (
                    <li key={review.idReview}>
                    <h3>{review.userSet.idAuth0}</h3>
                        <p>{review.rate}</p>
                        <Rating name="simple-controlled" value={review.rate}  readOnly/>
                    <p>
                        {review.comment}
                    </p>
                    </li>
                )):null}
                </ul>
                <button className="add" onClick={showReviewForm}>Add new review</button>
                {showForm ? <FormReview place={idPlace}/> : null}
            </div>
    )
};

export default Reviews;