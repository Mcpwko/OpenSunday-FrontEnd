import React, {useContext, useEffect, useState} from 'react';
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Auth0Context} from "@auth0/auth0-react";
import Rating from "@material-ui/lab/Rating";
import {FormReview} from "./FormReview";
import "./Reviews.css";
import {UserContext} from "../context/UserContext";
import ConfirmDialog from "../components-reusable/ConfirmDialog";
import {useAlert} from "react-alert";

function Reviews(props) {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState();
    const [removeReviewDialog, setRemoveReviewDialog] = useState(false);
    const [id, setId] = useState(0);
    const [banUserDialog, setBanUserDialog] = useState(false);
    /*Context*/
    const authContext = useContext(Auth0Context);
    const userContext = useContext(UserContext);
    /*Hooks*/
    const alert = useAlert();
    //Variable
    const idPlace = props.idPlace;

    useEffect(() => {
        async function getReviews() {
            let review = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.review}${props.idPlace}`,
                authContext.getAccessTokenSilently
            );
            if (review != null) {
                setReviews(review);
            }
        }

        getReviews();
    }, [props.idPlace, id]);

    const addReview = () => {
        setId(1);
    }

    async function banUser() {
        await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.banUser}${id}`,
            authContext.getAccessTokenSilently
        );
        setId(0);
        alert.success("User has been banned !");
    }

    async function removeReview() {
        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.reviews}${id}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
            },
        });
        userContext.refresh();
        alert.success("The review has been removed !");
        setId(0);
    }


    return (
        <div>
            <ul style={{listStyleType: "none", padding: "0", margin: "0"}}>
                {reviews != null ? reviews.map((review) => (
                    <li className="listReviews" key={review.idReview}>
                        <h3>{review.userSet.pseudo}
                        </h3>
                        <Rating name="simple-controlled" value={review.rate} readOnly/>
                        <p>
                            {review.comment}
                        </p>
                        {userContext.user.idUserType == 3 ? <button key={review.idReview} className="buttonRemove"
                                                                    onClick={() => (setRemoveReviewDialog(true), setId(review.idReview))}>Remove
                            review</button> : null}<br/>
                        <ConfirmDialog
                            title="WARNING: This review will be deleted"
                            open={removeReviewDialog}
                            setOpen={setRemoveReviewDialog}
                            onConfirm={removeReview}
                        >
                            Are you sure you want to delete this review ? {id}<br/>
                            This action cannot be undone!<br/>
                        </ConfirmDialog>
                        {userContext.user.idUserType == 3 && review.userSet.idUserType != 3 ?
                            <button className="buttonBan"
                                    onClick={() => (setBanUserDialog(true), setId(review.idUser))}>Ban</button> : null}
                        <ConfirmDialog
                            title="WARNING: This user will be banned"
                            open={banUserDialog}
                            setOpen={setBanUserDialog}
                            onConfirm={banUser}
                        >
                            Are you sure you want to ban this user ?<br/>
                        </ConfirmDialog>
                    </li>
                )) : null}
            </ul>
            <FormReview place={{idPlace}} addReview={addReview}/>

        </div>
    )
};

export default Reviews;