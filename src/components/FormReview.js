import React, {useContext, useRef, useState} from 'react';
import Rating from "@material-ui/lab/Rating";
import {Auth0Context} from "@auth0/auth0-react";
import endpoints from "../endpoints.json";
import styled from "styled-components";



const Modal = styled.div`
    // display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 10000; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
`;

export const FormReview = (props) => {


    //const [comment, setComment] = useState('');
    //const [rating, setRating] = useState(0);
    let rating;
    //let comment = document.getElementById('comment').nodeValue;

    const authContext = useContext(Auth0Context);

    let addNewReview = async () => {

        /*
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
        });*/

    };



    return (
        <Modal>
            <form>
                <Rating name="simple-controlled" />
                Comment : <input type="text" id="comment" name="comment"/>
                <input type="submit" value="Submit"/>
            </form>
        </Modal>

    );

}