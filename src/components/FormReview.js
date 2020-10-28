import React, {useContext, useRef, useState} from 'react';
import Rating from "@material-ui/lab/Rating";
import {Auth0Context} from "@auth0/auth0-react";
import endpoints from "../endpoints.json";

export const FormReview = (props) => {


    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);

    const authContext = useContext(Auth0Context);

    let addNewReview = async () => {

        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.review}`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${authContext.getAccessTokenSilently()}`,
                'Content-Type': "application/json",
            }, body: JSON.stringify({
                text: rating,
                comment: comment,
                idUser: authContext.sub,
                idPlace: props.place
            })
        });

    };



    return (
        <modal>
            <form onSubmit={addNewReview()}>
                <Rating name="simple-controlled" value={setRating(rating)} />
                <label>
                    Comment :
                    <input type="text" value={setComment(comment)} onChange={this.handleChange}/>
                </label>
                <input type="submit" />
            </form>
        </modal>


    );

}