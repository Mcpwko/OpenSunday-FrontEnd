import React, {useContext, useState} from 'react';
import Rating from "@material-ui/lab/Rating";
import {Auth0Context} from "@auth0/auth0-react";
import endpoints from "../endpoints.json";
import styled from "styled-components";
import {Formik} from "formik";
import * as Yup from "yup";
import Box from "@material-ui/core/Box";
import {Button, Form, Modal} from "react-bootstrap";
import {useAlert} from "react-alert";
import {UserContext} from "../context/UserContext";

const MyForm = styled(Form)`
  width: 80%;
  text-align: left;
  @media(min-width: 786px) {
    width: 50%;
  }
`;

export function FormReview(props) {

    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(0);
    const alert = useAlert();
    const userContext = useContext(UserContext);
    const authContext = useContext(Auth0Context);

    function toggleModal() {
        setShow(show ? false : true);
    }

    function showModal() {
        if (!show)
            if (userContext.user.pseudo != null) {
                setShow(true);
            } else {
                alert.error("You don't have a pseudo yet !");
                alert.error("Please complete your profile in 'My Account' ! ");
            }

    };

    //let history = useHistory();

    function handleClick() {
        props.onClose();
        //history.push("/map");
    }


    let validationSchema = Yup.object().shape({
        comment: Yup.string()
            .max(120, "Must be 60 characters or less")
            .required("A comment is required !"),
    });


    return (

        <div>

            {authContext.isAuthenticated ?
                <button className="add" onClick={showModal}>Add new review
                    <Modal show={show} onHide={toggleModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Write a review for {props.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Formik
                                initialValues={{
                                    comment: "",
                                    rate: ""
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values, {setSubmitting, resetForm}) => {
                                    // When button submits form and form is in the process of submitting, submit button is disabled
                                    setSubmitting(true);
                                    //POST Review into the DB

                                    if (userContext.user.reviewSet.filter(x => x.idPlace == props.place.idPlace).length < 1) {

                                        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.insertReview}`, {
                                            method: 'POST',
                                            headers: {
                                                Accept: "application/json",
                                                Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
                                                'Content-Type': "application/json"
                                            },
                                            body: JSON.stringify({
                                                    rate: rating,
                                                    comment: values.comment,
                                                    idUser: userContext.user.idUser,
                                                    idPlace: props.place.idPlace
                                                }
                                            ),
                                        });
                                        props.addReview();
                                        userContext.refreshPlaces();
                                        userContext.user.reviewSet.push({
                                            rate: rating,
                                            comment: values.comment,
                                            idUser: userContext.user.idUser,
                                            idPlace: props.place.idPlace
                                        });
                                        setRating(0);
                                        resetForm();
                                        setSubmitting(false);
                                        toggleModal();
                                        alert.success("Your comment has been published !");
                                    } else {
                                        alert.error("You already post a review for this place");
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
                                            <Form.Label className={"show"}>Your comment : </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="comment"
                                                placeholder="Give your opinion !"
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

                                        {/*============================== Rate - RATING ==================================*/}

                                        <h3>Rate :</h3>
                                        <Box component="fieldset" mb={3} borderColor="transparent">
                                            <Rating name="simple-controlled" value={rating} precision={1}
                                                    onChange={(event, newValue) => setRating(newValue)}/>
                                        </Box>

                                        {/*============================== SUBMIT BUTTON ==================================*/}
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={toggleModal}>
                                                Close
                                            </Button>
                                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                                Save Comment
                                            </Button>
                                        </Modal.Footer>
                                    </MyForm>

                                )}
                            </Formik>
                        </Modal.Body>

                    </Modal>
                </button> : null}
        </div>


    );

}