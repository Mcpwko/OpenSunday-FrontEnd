import React, {useState, useEffect, useContext, Fragment} from 'react';
import styled from 'styled-components';
import {Form, Button, Col} from 'react-bootstrap';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import "./FormPlace.css";
import {string} from "yup/lib/locale";
import axios from "axios";
import Place from "./Place";
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import GetCategories from "../database/GetCategories";
import GetTypes from "../database/GetTypes";
import GetRegions from "../database/GetRegions";


const Container = styled.div`
  // background: #F7F9FA;
  height: auto;
  width: 90%;
  margin: 5em auto;
  margin-top:0em;
  color: snow;
  // -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  // -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  // box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  @media(min-width: 786px) {
    width: 60%;
  }
  label {
    color: #24B9B6;
    // font-size: 1.2em;
    // font-weight: 400;
  }
  // .error {
  //   border: 2px solid #FF6565;
  // }
  .has-error {
    border: 2px solid #FF6565;
  }
  .error-message {
    color: #FF6565;
    padding: .5em .2em;
    height: 1em;
    position: absolute;
    font-size: .8em;
    text-align: center;
  }
  h1 {
    color: #24B9B6;
    text-align: center;
    background-color:white;
    border: 2px solid black;
    border-radius: 8px;
  }
  .form-group {
    // margin-bottom: 2.5em;
  }
  h2{
    text-align: center;
     font-size: 1em;
     font-weight: 400;
      padding: 0.8em;
     color: #24B9B6;
`;

const MyForm = styled(Form)`
  width: 80%;
  text-align: left;
  // padding-top: 2em;
  // padding-bottom: 2em;
  @media(min-width: 786px) {
    width: 50%;
  }
`;

const SubmitButton = styled(Button)`

  background: #1863AB;
  border: none;
  font-size: 1.2em;
  font-weight: 400;
  &:hover {
    background: #1D3461;
  }
  // margin-right: 2em;
`;

// const CancelButton = styled(Button)`
//   background: red;
//   border: none;
//   font-size: 1.2em;
//   font-weight: 400;
//   &:hover {
//     background: darkred;
//   }
// `;

const GetButton = styled(Button)`
margin-top:2em;
  background: darkgreen;
  border: none;
  font-size: 0.8em;
  font-weight: 300;
  &:hover {
    background: darkolivegreen;
  }
`;

// RegEx for phone number validation
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

// Schema for yup
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("A name for the place is required"),
    type: Yup.string()
        .required("Type is required"),
    category: Yup.string()
        .required('Category is required!'),
    description: Yup.string()
        .max(60, "Must be 60 characters or less")
        .required("Description required"),
    address: Yup.string()
        .max(40, "Must be 40 characters or less")
        .required("Required"),
    zip: Yup.string()
        .max(8, "Must be 8 characters or less")
        .required("Required"),
    city: Yup.string()
        .max(20, "Must be 8 characters or less")
        .required("Required"),
    region: Yup.string()
        .required("Required"),
    lat: Yup.number()
        .required("Required latitude"),
    long: Yup.number()
        .required("Required longitude"),
    email: Yup.string()
        .email("Invalid email address"),
    phone: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid'),
    website: Yup.string()
        .url("Invalid url")
});


export const FormPlace = (props) => {
    // const [showForm, setShowForm] = useState(false);

    const [latitude, setLatitude] = useState(props.latitude);
    const [longitude, setLongitude] = useState(props.longitude);

    const [visible, setVisible] = useState(props.gcButton);
    const [errorGC, setErrorGC] = useState(false);


    let url = "https://us1.locationiq.com/v1/search.php?key=pk.a9fb192a815fa6985b189ffe5138383b&q=";
    let endUrl = "&format=json";
    // let add = "Ch.%20des%20An%C3%A9mones%206%2C%203960%20Sierre"

    // API - locationiq.com - 5000 requests/day - 2 requests / second
    async function SearchPosition(adr, city, zip) {

        const fullAddress = encodeURIComponent(adr + "," + city + "," + zip);

        const request = url + fullAddress + endUrl;

        const response = await axios.get(request)
            .catch(err => console.log(err))

        // If an error occurs, the latitude and longitude are not modified
        if (response !== undefined) {
            setErrorGC(false);
            const data = response.data;
            setLatitude(data[0].lat);
            setLongitude(data[0].lon);
        } else {
            // setLatitude(0);
            // setLongitude(0);
            setErrorGC(true);
        }
        // console.log(data[0].lat);
        // console.log(props.toString());
        // console.log(data[0].lat);
        // console.log(data[0].lon);
        // console.log(latitude);
        // console.log(longitude);
    }

    // API - locationiq.com - 5000 requests/day - 2 requests / second
    async function SearchAddress(address, zip, city) {

        const latLong = encodeURIComponent(address + "," + zip + "," + city);

        const request = url + latLong + endUrl;

        const response = await axios.get(request)
            .catch(err => console.log(err))

        // If an error occurs, the latitude and longitude are not modified
        if (response !== undefined) {

        }
        //     setErrorGC(false);
        //     const data = response.data;
        //     setLatitude(data[0].lat);
        //     setLongitude(data[0].lon);
        // } else {
        //     setErrorGC(true);
        // }

    }

    return (
        // <Modal>
        <Container>
            {/*<Button onClick={displayForm}></Button>*/}
            {/*{showForm ?*/}
            <h1>Add a new place</h1>
            <Formik
                initialValues={{
                    name: "",
                    type: "", // added for our select
                    category: "", // added for our select
                    description: "",
                    address: "",
                    zip: "",
                    city: "",
                    region: "",
                    lat: latitude,
                    long: longitude,
                    email: "",
                    phone: "",
                    website: ""
                    // acceptedTerms: false, // added for our checkbox
                }}
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    // When button submits form and form is in the process of submitting, submit button is disabled
                    setSubmitting(true);

                    // This is a douille
                    values.lat = latitude;
                    values.long = longitude;

                    // Simulate submitting to database, shows us values submitted, resets form
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        resetForm();
                        setLongitude()
                        setSubmitting(false);
                    }, 500);
                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                  }) => (
                    <MyForm onSubmit={handleSubmit} className="mx-auto">
                        <Form.Group controlId="formName">
                            <Form.Label>Name of the place:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Name of the place"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className={touched.name && errors.name ? "has-error" : null}
                            />
                            {touched.name && errors.name ? (
                                <div className="error-message">{errors.name}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Group controlId="formType">
                            <Form.Label>Type of place:</Form.Label>
                            <Form.Control
                                as="select"
                                name="type"
                                value={values.type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.type && errors.type ? "has-error" : null}>

                                {GetTypes()}
                                {/*<option value="">Select a type of place</option>*/}
                                {/*<option value="restaurant">Restaurant</option>*/}

                            </Form.Control>
                            {touched.type && errors.type ? (
                                <div className="error-message">{errors.type}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Group controlId="formCategory">
                            <Form.Label>Category:</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={values.category}
                                onChange={handleChange}
                                onBlur={handleBlur}>

                                {GetCategories()}
                                {/*<option value="">Select a category</option>*/}
                                {/*<option value="chinese">Chinese</option>*/}

                            </Form.Control>
                            {touched.category && errors.category ? (
                                <div className="error-message">{errors.category}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Description of the place:</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Enter a description of some additional features"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                className={touched.description && errors.description ? "has-error" : null}
                                rows="10"
                            />
                            {touched.description && errors.description ? (
                                <div className="error-message">{errors.description}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Group controlId="formAddress">
                            <Form.Label>Name of the place:</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                placeholder="Address of the place and number if known"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.address}
                                className={touched.address && errors.address ? "has-error" : null}
                            />
                            {touched.address && errors.address ? (
                                <div className="error-message">{errors.address}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Row style={{marginBottom: "1em"}}>
                            <Col>
                                <Form.Label>Zip of the place:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="zip"
                                    placeholder="Zip of the place"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.zip}
                                    className={touched.zip && errors.zip ? "has-error" : null}
                                />
                                {touched.zip && errors.zip ? (
                                    <div className="error-message">{errors.zip}</div>
                                ) : null}
                            </Col>
                            <Col>
                                <Form.Label>City of the place:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    placeholder="City of the place"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.city}
                                    className={touched.city && errors.city ? "has-error" : null}
                                />
                                {touched.city && errors.city ? (
                                    <div className="error-message">{errors.city}</div>
                                ) : null}
                            </Col>
                            <Col>
                                {/*<Form.Group controlId="formType">*/}
                                <Form.Label>Region of place:</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="region"
                                    value={values.region}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.region && errors.region ? "has-error" : null}>

                                    {GetRegions()}

                                </Form.Control>
                                {touched.region && errors.region ? (
                                    <div className="error-message">{errors.region}</div>
                                ) : null}
                                {/*</Form.Group>*/}
                            </Col>
                        </Form.Row>

                        {errorGC ? (
                            <div className="error-message">Address incomplete/not found, change and try
                                again</div>
                        ) : null}

                        <div className="buttons">
                            {visible ? <GetButton variant="secondary" type="button"
                                                  onClick={() => SearchPosition(values.address, values.zip, values.city)}
                                                  active={false}>
                                Get coordinates
                            </GetButton> : null}

                        </div>

                        <Form.Row>
                            <Col>
                                <Form.Label className={"show"}> Latitude </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lat"
                                    placeholder="Latitude"
                                    // onChange={handleChange}
                                    // onBlur={handleBlur}
                                    value={latitude}

                                    // className={touched.lat && errors.lat ? "has-error" : null}
                                    disabled
                                />
                                {touched.lat && errors.lat ? (
                                    <div className="error-message">{errors.lat}</div>
                                ) : null}
                            </Col>
                            <Col>
                                <Form.Label className={"show"}>Longitude</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="long"
                                    placeholder="Longitude"
                                    // onChange={handleChange}
                                    // onBlur={handleBlur}
                                    value={longitude}
                                    // className={touched.long && errors.long ? "has-error" : null}
                                    disabled
                                />
                                {touched.long && errors.long ? (
                                    <div className="error-message">{errors.long}</div>
                                ) : null}
                            </Col>
                        </Form.Row>


                        <Form.Group controlId="formEmail">

                            <h2>Optional</h2>

                            <Form.Control
                                type="text"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={touched.email && errors.email ? "has-error" : null}
                            />
                            {touched.email && errors.email ? (
                                <div className="error-message">{errors.email}</div>
                            ) : null}
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone :</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phone}
                                className={touched.phone && errors.phone ? "has-error" : null}
                            />
                            {touched.phone && errors.phone ? (
                                <div className="error-message">{errors.phone}</div>
                            ) : null}
                        </Form.Group>
                        <Form.Group controlId="formWebsite">
                            <Form.Label>Website :</Form.Label>
                            <Form.Control
                                type="text"
                                name="website"
                                placeholder="Website URL (Must start with https:// or http://)"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.website}
                                className={touched.website && errors.website ? "has-error" : null}
                            />
                            {touched.website && errors.website ? (
                                <div className="error-message">{errors.website}</div>
                            ) : null}
                        </Form.Group>

                        <div className="buttons">
                            {/*Submit button that is disabled after button is clicked/form is in the process of submitting*/}
                            <SubmitButton variant="primary" type="submit" disabled={isSubmitting}>
                                Submit
                            </SubmitButton>
                            {/*<CancelButton variant="secondary" type="cancel" className="cancel">*/}
                            {/*    Cancel*/}
                            {/*</CancelButton>*/}
                        </div>
                    </MyForm>
                )}
            </Formik>
            {/*: null}*/}
        </Container>

        // </Modal>
    );
}