import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faEdit} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from 'react-router-dom';
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Auth0Context} from "@auth0/auth0-react";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Reviews from "./Reviews";
import Modal from "react-bootstrap";

function Details (props){
    const[rate,setRate] = useState(0);
    const authContext = useContext(Auth0Context);

    useEffect(()=>{
        async function getRate(){
            let review = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.rate}${props.idPlace}`,
                authContext.getAccessTokenSilently
            );

            if (review >= 0) {
                setRate(review);
            }
        }
        getRate();
    },[]);

    //let history = useHistory();

    function handleClick() {
        props.onClose();
        //history.push("/map");
    }


    return(
        <div className={`listVenues ${props.onOpen ? "in" : ""}`}>
            <button className="toolsBtn"
                     onClick={handleClick}
            >
                <span>❌</span>
            </button> {console.log("PROPS : " + props.idPlace)}
            <h1>{props.name} {props.isVerified ?
                <FontAwesomeIcon icon={faCheckCircle}/> :
                <button>
                    <FontAwesomeIcon icon={faEdit}/>
                </button>}
            </h1>

            <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Read only</Typography>
                <Rating name="simple-controlled" value={rate}  precision={0.5} readOnly/>
            </Box>


            <h2>{props.categorySet.name}</h2>
            <h2>{props.typeSet.name}</h2>
            <p>
                Open on sundays : {
                props.isOpenSunday ?
                    <span>✔</span> : <span>❌</span>
            }
            </p>
            <p>
                Open on Special Days : {
                props.isOpenSpecialDay ?
                    <span>✔</span> : <span>❌</span>
            }
            </p>
            <table>
                <tbody>
                <tr>
                    <td style={{align:"center"}}>{props.description}</td>
                </tr>
                <tr>
                    <td>{props.locationSet.address}</td>
                </tr>
                <tr>
                    <td>{props.locationSet.regionSet.name}</td>
                </tr>
                <tr>
                    <td>{props.locationSet.citySet.name}</td>
                </tr>
                <tr>
                    <td>{props.email}</td>
                </tr>
                <tr>
                    <td>{props.website}</td>
                </tr>
                <tr>
                    <td>{props.phoneNumber}</td>
                </tr>
                </tbody>
            </table>
            <br/>
            <h1>Reviews</h1>
            <Reviews idPlace={props.idPlace}></Reviews>
            <h1>Something is wrong ?
                <button>Report</button>
            </h1>
        </div>
    )
}

export default Details