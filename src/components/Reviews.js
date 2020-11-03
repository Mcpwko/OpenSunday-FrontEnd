import React, {Fragment, useContext, useEffect, useState} from 'react';
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Auth0Context} from "@auth0/auth0-react";
import {Marker} from "react-leaflet";
import PlacesPopup from "./PlacesPopup";
import Rating from "@material-ui/lab/Rating";
import {FormPlace} from "./FormPlace";
import {FormReview} from "./FormReview";
import "./Reviews.css";
import userEvent from "@testing-library/user-event";
import {UserContext} from "../context/UserContext";


function Reviews (props) {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState();
    const authContext = useContext(Auth0Context);
    const userContext = useContext(UserContext);
    const idPlace = props.idPlace;

    useEffect( () => {
        async function getReviews(){
                let review = await request(
                    `${process.env.REACT_APP_SERVER_URL}${endpoints.review}${props.idPlace}`,
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
        console.log(showForm);
    }


    const closeForm = () => {
        setShowForm(false)
    }



    return(
            <div>
                <ul style={{listStyleType: "none", padding: "0", margin:"0"}}>
                {reviews!=null ? reviews.map((review) => (
                    <li className="listReviews" key={review.idReview}>
                    <h3>{review.userSet.pseudo }
                    </h3>
                        <Rating name="simple-controlled" value={review.rate}  readOnly/>
                    <p>
                        {review.comment}
                    </p>
                        {userContext.user.idUserType == 3 && review.userSet.idUserType!=3 ?<button className="buttonBan">Ban</button> : null}
                    </li>
                )):null}
                </ul>
                <FormReview place={{idPlace}}/>

            </div>
    )
};

export default Reviews;