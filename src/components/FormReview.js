import React, {useContext, useRef, useState} from 'react';
import Rating from "@material-ui/lab/Rating";
import {Auth0Context} from "@auth0/auth0-react";
import endpoints from "../endpoints.json";
import styled from "styled-components";
import {Formik} from "formik";
import * as Yup from "yup";
import Box from "@material-ui/core/Box";
import {Modal, Button,Form,Col} from "react-bootstrap";
import {Modal as Mod} from "../pages/MapView"
import request from "../utils/request";
import {useAlert} from "react-alert";

const MyForm = styled(Form)`
  width: 80%;
  text-align: left;
  // padding-top: 2em;
  // padding-bottom: 2em;
  @media(min-width: 786px) {
    width: 50%;
  }
`;

export function FormReview(props) {

    //const [comment, setComment] = useState('');
    //const [rating, setRating] = useState(0);

    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(0);
    const alert = useAlert();

    const authContext = useContext(Auth0Context);

    function showModal() {
        setShow(true);
    };

    function hideCommentModal() {
        setShow(false);
        console.log(show);
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
                    <Modal show={show} onHide={hideCommentModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Write a review for {props.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Formik
                                initialValues={{
                                    comment: "",
                                    rate:""
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values, {setSubmitting, resetForm}) => {
                                    // When button submits form and form is in the process of submitting, submit button is disabled
                                    setSubmitting(true);
                                    //POST Review into the DB
                                    let user = await request(
                                        `${process.env.REACT_APP_SERVER_URL}${endpoints.user}${'/'+ authContext.user.name}`,
                                        authContext.getAccessTokenSilently,
                                    )

                                    console.log("RATE",rating);
                                    console.log("COMMENT",values.comment);
                                    console.log("IDAUTH",user.idUser);
                                    console.log("IDPLACE",props.place);

                                    await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.review}`, {
                                        method: 'POST',
                                        headers: {
                                            Accept: "application/json",
                                            Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
                                            'Content-Type': "application/json"
                                        },
                                        body: JSON.stringify({
                                                rate: rating,
                                                comment: values.comment,
                                                idUser: user.idUser,
                                                idPlace: props.place
                                            }
                                        ),
                                    });

                                    resetForm();
                                    setSubmitting(false);
                                    hideCommentModal();
                                    alert.success("Your comment has been published !");
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
                                                <div style={{color:"red"}} className="error-message">{errors.comment}</div>
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
                                            <Button variant="secondary"  onClick={hideCommentModal}>
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
                </button>: null}
        </div>


    );

}