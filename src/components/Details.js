import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faEdit} from "@fortawesome/free-solid-svg-icons";
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Auth0Context} from "@auth0/auth0-react";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import Reviews from "./Reviews";
import {Button, Col, Form, Modal} from "react-bootstrap";
import {Formik} from "formik";
import {Modal as Mod} from "../pages/MapView"
import {FormPlace} from "./FormPlace";
import * as Yup from "yup";
import styled from "styled-components";
import {useAlert} from "react-alert";
import "./Details.css";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import {UserContext} from "../context/UserContext";
import ConfirmDialog from "../components-reusable/ConfirmDialog";

const MyForm = styled(Form)`
  width: 80%;
  text-align: left;
  // padding-top: 2em;
  // padding-bottom: 2em;
  @media(min-width: 786px) {
    width: 50%;
  }
`;

function Details(props) {
    const [rate, setRate] = useState(0);
    const [show, setShow] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [removePlace, setRemovePlace] = useState(false);
    /*Context */
    const userContext = useContext(UserContext);
    const authContext = useContext(Auth0Context);
    /*Hooks*/
    const alert = useAlert();
    const history = useHistory();
    const path = useLocation();

    useEffect(() => {
        async function getRate() {
            let review = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.rate}${props.idPlace}`,
                authContext.getAccessTokenSilently
            );

            if (review >= 0) {
                setRate(review);
            }
        }

        getRate();
    }, [props, path]);


    function showModal() {
        if (userContext.user.pseudo != null) {
            setShow(true);
        } else {
            alert.error("You don't have a pseudo yet !");
            alert.error("Please complete your profile in 'My Account' ! ");
        }
    };

    function hideModal() {
        setShow(false);
    };

    const closeForm = () => {
        setShowForm(false)
    }

    const validatePlace = async () => {
        let place = await request(`${process.env.REACT_APP_SERVER_URL}${endpoints.verifyPlace}${props.idPlace}`,
            authContext.getAccessTokenSilently
        );
        if (place != null) {
            alert.success(props.name + " has been verified !")
            userContext.refreshPlaces();
        }
    }

    const deletePlace = async () => {
        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.placesRoad}${props.idPlace}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
            },
        });

        alert.success(props.name + " has been deleted !");
        userContext.refreshPlaces();
        history.push("/map");

    }

    function handleClick() {
        props.onClose();
    }


    let validationSchema = Yup.object().shape({
        comment: Yup.string()
            .max(120, "Must be 60 characters or less")
            .required("A description of the report is required !"),
        choice: Yup.string()
            .required("Choose an option !")
    });


    return (
        <div className={`listVenues ${props.onOpen ? "in" : ""}`}>
            <button className="toolsBtn"
                    onClick={handleClick}
            >
                <span>❌</span>
            </button>

            <h1>
                {props.name}
                {props.isVerified && <FontAwesomeIcon icon={faCheckCircle}/>}
                {(!props.isVerified || userContext.user.idUserType == 3) &&

                <button onClick={() => {
                    if (userContext.user.pseudo != null) {
                        setShowForm(true)
                    } else {
                        alert.error("You don't have a pseudo yet !");
                        alert.error("Please complete your profile in 'My Account' ! ");
                    }

                }}>
                    <FontAwesomeIcon icon={faEdit}/>
                </button>}


            </h1>

            <Box component="fieldset" mb={3} borderColor="transparent">
                <Rating name="simple-controlled" value={rate} precision={0.5} readOnly/>
            </Box>

            {showForm ? <Mod>
                <span id="close" onClick={closeForm}>&times;</span>
                <FormPlace place={props} closeForm={closeForm} modification={true}/>
            </Mod> : null}


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
            <table className="tableDetails">
                <tbody>
                <tr>
                    <td>{props.description}</td>
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
            {authContext.isAuthenticated && props.isVerified ?
                <h1>Something is wrong ?
                    <a className="text-danger" onClick={showModal}>Report</a>
                    <Modal show={show} onHide={hideModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Report {props.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Formik
                                initialValues={{
                                    comment: "",
                                    choice: ""
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values, {setSubmitting, resetForm}) => {
                                    // When button submits form and form is in the process of submitting, submit button is disabled
                                    setSubmitting(true);
                                    //POST Report into the DB
                                    console.log(userContext.reportChange)

                                    if (userContext.user.reportSet.filter(x => x.idPlace == props.idPlace).length < 1) {

                                        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.report}`, {
                                            method: 'POST',
                                            headers: {
                                                Accept: "application/json",
                                                Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
                                                'Content-Type': "application/json"
                                            },
                                            body: JSON.stringify({
                                                    comment: values.comment,
                                                    isForDelete: values.choice === 'IsForDelete',
                                                    isForEdit: values.choice === 'IsForEdit',
                                                    idUser: userContext.user.idUser,
                                                    idPlace: props.idPlace,
                                                    status: true
                                                }
                                            ),
                                        });

                                        userContext.user.reportSet.push({
                                            comment: values.comment,
                                            isForDelete: values.choice === 'IsForDelete',
                                            isForEdit: values.choice === 'IsForEdit',
                                            idUser: userContext.user.idUser,
                                            idPlace: props.idPlace
                                        });

                                        resetForm();
                                        setSubmitting(false);
                                        hideModal();
                                        alert.success("Your report has been submitted !");
                                    } else {
                                        alert.error("You already report this place !")
                                    }
                                }}
                            >
                                {({
                                      values,
                                      errors,
                                      touched,
                                      handleChange,
                                      handleBlur,
                                      handleSubmit,
                                      isSubmitting,
                                      setFieldValue,
                                  }) => (
                                    <MyForm onSubmit={handleSubmit} className="mx-auto">

                                        {/*============================== Comment - TEXTAREA ==================================*/}
                                        <Form.Group controlId="formComment">
                                            <Form.Label className={"show"}>Describe the problem : </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="comment"
                                                placeholder="Is there a mistake on the information about the place ?"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.comment}
                                                className={touched.comment && errors.comment ? "has-error" : null}
                                                rows={2}
                                            />
                                            {touched.comment && errors.comment ? (
                                                <div style={{color: "red"}}
                                                     className="error-message">{errors.comment}</div>
                                            ) : null}
                                        </Form.Group>

                                        {/*============================== TYPEOFREPORT - EDIT - DELETE ==================================*/}

                                        <h3>Choose one option :</h3>

                                        <Form.Row>
                                            <Col>
                                                <Form.Label className={"show"}>Any error on the information
                                                    ?</Form.Label>
                                                <Form.Check
                                                    type="radio"
                                                    name="choice"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value="IsForEdit"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Label className={"show"}>This place doesn't exist anymore
                                                    ?</Form.Label>
                                                <Form.Check
                                                    type="radio"
                                                    name="choice"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value="IsForDelete"
                                                />
                                            </Col>
                                        </Form.Row>
                                        {touched.choice && errors.choice ? (
                                            <div style={{color: "red"}} className="error-message">{errors.choice}</div>
                                        ) : null}
                                        {/*============================== SUBMIT BUTTON ==================================*/}
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={hideModal}>
                                                Close
                                            </Button>
                                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    </MyForm>

                                )}
                            </Formik>
                        </Modal.Body>

                    </Modal>
                </h1> : null}
            <h1>Share with your friends !</h1>
            <WhatsappShareButton
                url={window.location.href}
                title={"OpenSunday : " + props.name}
                className="Demo__some-network__share"
            >
                <WhatsappIcon size={32} round/>
            </WhatsappShareButton>
            <FacebookShareButton
                url={window.location.href}
                title={"OpenSunday : " + props.name}
                className="Demo__some-network__share"
            >
                <FacebookIcon size={32} round/>
            </FacebookShareButton>
            <TwitterShareButton
                url={window.location.href}
                title={"OpenSunday : " + props.name}
                className="Demo__some-network__share"
            >
                <TwitterIcon size={32} round/>
            </TwitterShareButton>
            <EmailShareButton
                url={window.location.href}
                title={"OpenSunday : " + props.name}
                className="Demo__some-network__share"
            >
                <EmailIcon size={32} round/>
            </EmailShareButton>

            <ConfirmDialog
                title="WARNING: This place will be deleted"
                open={removePlace}
                setOpen={setRemovePlace}
                onConfirm={deletePlace}
            >
                Are you sure you want to delete this Place ? {props.idPlace}<br/>
                This action cannot be undone!<br/>
            </ConfirmDialog>
            <br/>
            {(!props.isVerified && userContext.user.idUserType == 3) &&
            <button className="validatePlace" onClick={validatePlace}>Validate Place</button>}
            {(userContext.user.idUserType == 3) &&
            <button className="deletePlace" onClick={() => setRemovePlace(true)}>Delete Place</button>}
        </div>
    )
}

export default withRouter(Details)