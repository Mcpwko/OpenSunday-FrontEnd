import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Button, Col, Form} from 'react-bootstrap';
import {Formik} from 'formik';
import * as Yup from 'yup';
import "./FormPlace.css";
import axios from "axios";
import GetCategories from "../database/GetCategories";
import GetTypes from "../database/GetTypes";
import GetRegions from "../database/GetRegions";
import endpoints from "../endpoints.json";
import moment from "moment";
import { useAuth0 } from "@auth0/auth0-react";
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";

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
    background-color:#282c34;
    border: 2px solid white;
    border-radius: 8px;
    padding:0.3em;
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
  }
  sub{
    color: darkred;
    background: grey;
    text-align: center;
  }
  
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
        .max(120, "Must be 60 characters or less"),
    // .required("Description required"),
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



let fetchPlace = async (values, token) => {

    await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.insertPlace}`, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            'Content-Type': "application/json",
        }, body: JSON.stringify({
            name: values.name,
            description: values.description,
            email: values.email,
            website: values.website,
            phoneNumber: values.phoneNumber,
            isOpenSunday: true,
            isOpenSpecialDay: true,
            isVerified: false,
            isAdvertised: false,
            lat: values.lat,
            long: values.long,
            address: values.address,
            zip: values.zip,
            city: values.city,
            idRegion: values.region,
            idCategory: values.category,
            idType: values._type
        })
    });

};



export const FormPlace = (props) => {
    // const [showForm, setShowForm] = useState(false);

    const [latitude, setLatitude] = useState(props.latitude);
    const [longitude, setLongitude] = useState(props.longitude);


    let myZip = "";
    let myCity = "";

    const [visible, setVisible] = useState(props.gcButton);
    const [errorGC, setErrorGC] = useState(false);

    const [zipCity, setZipCity] = useState([]);

    const url = "https://us1.locationiq.com/v1/search.php?key=pk.a9fb192a815fa6985b189ffe5138383b&q=";
    const endUrl = "&format=json";
    const reverseUrl = "https://us1.locationiq.com/v1/reverse.php?key=pk.a9fb192a815fa6985b189ffe5138383b&"
    const reverseEndUrl = "&normalizeaddress=1&format=json";
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
        // console.log(data[0].lon);
    }

    // API - locationiq.com - 5000 requests/day - 2 requests / second
    async function SearchLocation(lat, long) {

        const requestAddress = encodeURI("lat=" + lat + "&lon=" + long);

        const request = reverseUrl + requestAddress + reverseEndUrl;

        const response = await axios.get(request)
            .catch(err => console.log(err))

        // If an error occurs, the latitude and longitude are not modified
        if (response !== undefined) {
            // setErrorGC(false);
            const data = response.data;

            // console.log("Sl" + data.address.postcode);
            // console.log("SL" + data.address.city);


            myZip = data.address.postcode;
            myCity = data.address.city;
        }
        // No error handling necessary, if it does not found anything: nothing changes
        else {
        }
    }

    function simulateClick(e) {
        e.click()
        console.log("CLICKED ;)");
    }


    return (
        // <Modal>
        <Container>
            {console.log(latitude)}
            {console.log(myZip)}
            {/*<Button onClick={displayForm}></Button>*/}
            {/*{showForm ?*/}
            <h1>Add a new place</h1>
            <h5 style={{color: "#DDDDDD"}}>* = mandatory</h5>
            {/*<textpath>Testmy</textpath>*/}
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
                        setSubmitting(false);
                    }, 500);
                    // return true;
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
                        {/*{visible ? null : <InitializeForm/>}*/}

                        {visible ? null : <div className="buttons">
                            <GetButton variant="secondary" type="button" ref={simulateClick} style={{display: "none"}}
                                       onClick={() => {
                                           SearchLocation(latitude, longitude)
                                               .then(() => setFieldValue('zip', myZip))
                                               .then(() => setFieldValue('city', myCity))
                                           //     .then(() => console.log("async" + myZip))
                                           //
                                           // console.log("after async" + myZip);
                                           // setFieldValue('name', myZip);
                                       }
                                       }
                                // active={false}
                            >
                                Get zip and city
                            </GetButton>
                        </div>}

                        {/*<GetButton variant="secondary" type="button"*/}
                        {/*           onClick={() => {*/}
                        {/*               console.log(myZip)*/}
                        {/*           }*/}
                        {/*           }*/}
                        {/*           active={false}>*/}
                        {/*    Show value*/}
                        {/*</GetButton>*/}

                        <Form.Group controlId="formName">
                            <Form.Label>Name of the place:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Name of the place*"
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

                        {/*============================== DESCRIPTION - TEXTAREA ==================================*/}
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description of the place:</Form.Label>
                            <Form.Control
                                as="textarea"
                                // type="textArea"
                                name="description"
                                placeholder="Enter a description of some additional features (optional)"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                className={touched.description && errors.description ? "has-error" : null}
                                rows={1.8}
                            />
                            {touched.description && errors.description ? (
                                <div className="error-message">{errors.description}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Group controlId="formAddress">
                            <Form.Label>Address of the place:</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                placeholder="Address of the place* and number if known"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.address}
                                className={touched.address && errors.address ? "has-error" : null}
                            />
                            {touched.address && errors.address ? (
                                <div className="error-message">{errors.address}</div>
                            ) : null}
                        </Form.Group>

                        {/*============================== ZIP - CITY - REGION ==================================*/}
                        <Form.Row style={{marginBottom: "1em"}}>
                            <Col>
                                <Form.Label>Zip of the place:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="zip"
                                    placeholder="Zip / Postal code*"
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
                                    placeholder="City*"
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


                        {/*============================== LAT & LONG ==================================*/}
                        <Form.Row>
                            <Col>
                                <Form.Label className={"show"}>Latitude*</Form.Label>
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
                                <Form.Label className={"show"}>Longitude*</Form.Label>
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

                        {/*============================== OPTIONAL PART OF THE FORM ==================================*/}
                        <h2>Optional</h2>
                        <Form.Group controlId="formEmail">
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

                        {/*============================== SUBMIT BUTTON ==================================*/}
                        <div className="buttons">
                            {/*Submit button that is disabled after button is clicked/form is in the process of submitting*/}
                            {latitude !== 0 ? <SubmitButton variant="primary" type="submit" disabled={isSubmitting} onClick={fetchPlace(values, props.token)}>
                                Submit
                            </SubmitButton> : <div><sub>Latitude and longitude are needed for submitting</sub><br/>
                                <sub>Click on "Get coordinates" button</sub></div>}
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