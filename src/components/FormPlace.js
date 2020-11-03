import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Button, Col, Form} from 'react-bootstrap';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import "./FormPlace.css";
import axios from "axios";
import GetCategories from "../database/GetCategories";
import GetTypes from "../database/GetTypes";
import GetRegions from "../database/GetRegions";
import endpoints from "../endpoints.json";
import moment from "moment";
import {useAuth0} from "@auth0/auth0-react";
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import {useAlert} from "react-alert";

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
  // text-align:center;
    color: #24B9B6;
    background:#282c34;
    border-radius:10px;
    opacity:0.8;
    padding-left:5%;
    padding-right:5%;
    margin-top:15px;
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
    padding: 0.1em;
    margin: 0.8em;
    color: #24B9B6;
    border-radius:4px;
    opacity:0.95;
    background:#282c34;
    margin-top:2em;
    // padding-left:5px;
    // padding-right:5px;
  }
  sub{
    color: darkred;
    background: grey;
    text-align: center;
  }
  
  .col{
  text-align:center;}
  
.form-check {
    // text-align: center;
}

input[type=checkbox] {
    border-radius: 50%
    /* Double-sized Checkboxes */
    -ms-transform: scale(2); /* IE */
    -moz-transform: scale(2); /* FF */
    -webkit-transform: scale(2); /* Safari and Chrome */
    -o-transform: scale(2); /* Opera */
    padding: 10px;
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

export const SubmitButton = styled(Button)`
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

/**
 * Validation schema for Yup (Validation for the form with Formik)
 */
let validationSchema = Yup.object().shape({
    name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("A name for the place is required"),
    type: Yup.string()
        .required("Type is required"),
    category: Yup.string()
        .required("Category is required"),
    description: Yup.string()
        .max(120, "Must be 60 characters or less"),
    address: Yup.string()
        .max(40, "Must be 40 characters or less")
        .required("Required"),
    zip: Yup.string()
        .max(8, "Must be 8 characters or less")
        .required("Required"),
    city: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    region: Yup.string()
        .required("Required"),
    lat: Yup.number()
        .required("Required latitude"),
    long: Yup.number()
        .required("Required longitude"),
    openSunday: Yup.boolean(),
    openSpecialDay: Yup.boolean(),
    email: Yup.string()
        .email("Invalid email address"),
    phoneNumber: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid"),
    website: Yup.string()
        .url("Invalid url")
});

// /** Partially retrieved on: https://github.com/jquense/yup/issues/72 */
// /** Partially retrieved on: https://runkit.com/sbreiler/5d5cf7a7fff9950013857ac5*/
// // Extended validation
// validationSchema = validationSchema.test( // this test is added additional to any other (build-in) tests
//     'myCustomCheckboxTest',
//     null, // we'll return error message ourself if needed
//     (obj) => {
//         // only testing the checkboxes here
//         if (obj.openSunday || obj.openSpecialDay) {
//             return true; // everything is fine
//         }
//
//         return new Yup.ValidationError(
//             '❗ Check at least one checkbox',
//             null,
//             'openSunday'
//         );
//     }
// );


export const FormPlace = (props) => {
    // const [showForm, setShowForm] = useState(false);

    const [latitude, setLatitude] = useState(props.latitude);
    const [longitude, setLongitude] = useState(props.longitude);

    // Boolean to toggle the edit mode
    const [modification, setModification] = useState(false);

    //Boolean when edition is from a search with info in the popup
    const [add, setAdd] = useState(false);

    // Retrieve the array to modify
    const [placeEdit, setPlaceEdit] = useState([]);

    const [visible, setVisible] = useState(props.gcButton);
    const [errorGC, setErrorGC] = useState(false);

    const [zipCity, setZipCity] = useState([]);

    const authContext = useContext(Auth0Context);
    const alert = useAlert();

    let myZip = "";
    let myCity = "";

    /** Add with marker popup proposition */
    // if props.data changes
    useEffect(() => {
        // Edition mode activate
        if (props.data !== undefined) {
            setAdd(true)
        }
        // Edition mode deactivate
        else {
            setAdd(false);
        }

    }, [props.data]); // Execute only if place has changed

    /** Edition mode */
    // If props.place changes
    useEffect(() => {
        // Edition mode activate
        if (props.place !== undefined) {
            setModification(true)
        }
        // Edition mode deactivate
        else {
            setModification(false);
        }
    }, [props.place]); // Execute only if place has changed


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
        if (e !== null) {
            e.click()
            console.log("CLICKED ;)");
        }
    }

    function simulateProps(e) {

        // if(modification=)
        if (e !== null) {
            e.click()
            console.log("CLICKED ON PROPS ;)");
        }
    }

    return (
        // <Modal>
        <Container>
            {modification ?
                <h1>Edit {props.place.name} <span>✏</span></h1>
                :
                <h1>Add a new place</h1>
            }
            <h5 style={{color: "#DEDEDE"}}>* = mandatory</h5>

            <Formik
                initialValues={{
                    name: "",
                    type: "", // select
                    category: "", // select
                    description: "", // text area
                    address: "",
                    zip: "",
                    city: "",
                    region: "",
                    lat: latitude,
                    long: longitude,
                    openSunday: false, // checkbox
                    openSpecialDay: false, // checkbox
                    email: "",
                    phoneNumber: "",
                    website: ""
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, {setSubmitting, resetForm}) => {
                    // When button submits form and form is in the process of submitting, submit button is disabled
                    setSubmitting(true);

                    // As we do not work with values for latitude and longitude we have to set them with our respective states
                    values.lat = latitude;
                    values.long = longitude;
                    //POST place to DB

                    /** PUT **/
                    if(modification){
                        console.log("FORM EDIT");
                        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.places}${'/'+props.place.idPlace}`, {
                            method: 'PUT',
                            headers: {
                                // Accept: "application/json",
                                Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
                                'Content-Type': "application/json",
                            }, body: JSON.stringify({
                                idPlace: props.place.idPlace,
                                name: values.name,
                                description: values.description,
                                email: values.email,
                                website: values.website,
                                phoneNumber: values.phoneNumber,
                                isOpenSunday: values.openSunday,
                                isOpenSpecialDay: values.openSunday,
                                isVerified: false,
                                isAdvertised: false,
                                lat: values.lat,
                                Long: values.long,
                                address: values.address,
                                zip: values.zip,
                                city: values.city,
                                idRegion: values.region,
                                idCategory: values.category,
                                idType: values.type
                            })
                        });

                        alert.success("The place has been modified !");

                    }else{
                        console.log("FORM POST");
                    /**POST **/
                        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.insertPlace}`, {
                        method: 'POST',
                        headers: {
                           Accept: "application/json",
                           Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
                       'Content-Type': "application/json",
                       }, body: JSON.stringify({
                          name: values.name, description: values.description,
                            email: values.email,
                            phoneNumber: values.phoneNumber,
                            isOpenSunday: values.openSunday,
                            isOpenSpecialDay: values.openSunday,
                            isVerified: false,
                            isAdvertised: false,
                            lat: values.lat,
                            Long: values.long,
                            address: values.address,
                            zip: values.zip, city: values.city,
                            idRegion: values.region, idCategory: values.category,
                            idType: values.type
                         })
                     });

                        alert.success("The place has been added !");
                    }

                    resetForm();
                    setSubmitting(false);
                    props.closeForm();


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
                        {add ? <Button style={{display: "none"}}
                                       ref={simulateProps}
                                       onClick={() => {
                                           setFieldValue('name', props.data.name)
                                           setFieldValue('address', props.data.address)
                                           setFieldValue('zip', props.data.zip)
                                           setFieldValue('city', props.data.city)
                                           // console.log("I AM IN THE ADD" + props.data.name)
                                       }}
                        >
                        </Button> : null}

                        {/*Reset the form*/}
                        {visible ?
                            <SubmitButton style={{display: "none"}} type="reset" ref={simulateClick}>
                                {console.log("reseted")}
                            </SubmitButton>
                            : null}

                        {modification ? <Button style={{display: "none"}}
                                                ref={simulateProps}
                                                onClick={() => {
                                                    setFieldValue('name', props.place.name)
                                                    setFieldValue('description', props.place.description)

                                                    myCity = props.place.locationSet.citySet.name;
                                                    myZip = props.place.locationSet.citySet.npa;

                                                    setLatitude(props.place.locationSet.lat)
                                                    setLongitude(props.place.locationSet.long)
                                                        setFieldValue('lat', props.place.locationSet.lat)
                                                        setFieldValue('long', props.place.locationSet.long)

                                                    setFieldValue('type', props.place.typeSet.idType)
                                                    setFieldValue('category', props.place.categorySet.idCategory)
                                                    setFieldValue('region', props.place.locationSet.regionSet.idRegion)

                                                    //optional
                                                    setFieldValue('address', props.place.locationSet.address)
                                                    setFieldValue('email', props.place.email)
                                                    setFieldValue('website', props.place.website)
                                                    setFieldValue('phoneNumber', props.place.phoneNumber)

                                                    // checkboxes
                                                    setFieldValue('openSunday', props.place.isOpenSunday)
                                                    setFieldValue('openSpecialDay', props.place.isOpenSunday)


                                                }}
                        >
                        </Button> : null}

                        {visible ? null :
                            <div className="buttons">
                                <GetButton variant="secondary" type="button" ref={simulateClick}
                                           style={{display: "none"}}
                                           onClick={() => {
                                               SearchLocation(latitude, longitude)
                                                   .then(() => setFieldValue('zip', myZip))
                                                   .then(() => setFieldValue('city', myCity))
                                               //     .then(() => console.log("async" + myZip))
                                               //
                                               console.log("after async" + myZip);
                                               // setFieldValue('name', myZip);
                                           }
                                           }
                                    // active={false}
                                >
                                    Get zip and city
                                </GetButton>
                            </div>
                        }

                        {/*<GetButton variant="secondary" type="button"*/}
                        {/*           onClick={() => {*/}
                        {/*               console.log(myZip)*/}
                        {/*           }*/}
                        {/*           }*/}
                        {/*           active={false}>*/}
                        {/*    Show value*/}
                        {/*</GetButton>*/}

                        <Form.Group controlId="formName">
                            <Form.Label className="labelField">Name of the place:</Form.Label>
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
                            <Form.Label className="labelField">Type of place:</Form.Label>
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
                            <Form.Label className="labelField">Category of place:</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={values.category}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.category && errors.category ? "has-error" : null}>

                                {GetCategories()}
                                {/*<option value="">Select a category of place</option>*/}
                                {/*<option value="restaurant">Restaurant</option>*/}

                            </Form.Control>
                            {touched.category && errors.category ? (
                                <div className="error-message">{errors.category}</div>
                            ) : null}
                        </Form.Group>

                        {/*============================== DESCRIPTION - TEXTAREA ==================================*/}
                        <Form.Group controlId="formDescription">
                            <Form.Label className="labelField">Description of the place:</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                placeholder="Enter a description of some additional features (optional)"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                className={touched.description && errors.description ? "has-error" : null}
                                rows={2}
                            />
                            {touched.description && errors.description ? (
                                <div className="error-message">{errors.description}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Group controlId="formAddress">
                            <Form.Label className="labelField">Address of the place:</Form.Label>
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
                                <Form.Label className="labelField">Zip of the place:</Form.Label>
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
                                <Form.Label className="labelField">City of the place:</Form.Label>
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
                                <Form.Label className="labelField">Region of place:</Form.Label>
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
                                    type="number"
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

                        {/*============================== CHECKBOXES ==================================*/}
                        <Form.Row>
                            <Col>
                                <Form.Label className={"show"}>Open on Sunday ?</Form.Label>
                                <Form.Check>
                                    {/*<label className={"show"}>*/}
                                    <Field type="checkbox" name="openSunday"/>
                                    {/*{`${values.openSunday}`}*/}
                                    {/*</label>*/}
                                </Form.Check>

                                {/*<Form.Check*/}
                                {/*    type="checkbox"*/}
                                {/*    name="openSunday"*/}
                                {/*    // onChange={handleChange}*/}
                                {/*    onChange={(e) => {setFieldValue("openSunday", e.target.checked)}}*/}
                                {/*    onBlur={handleBlur}*/}
                                {/*    value={values.openSunday}*/}
                                {/*    // className={touched.openSunday && errors.openSunday ? "has-error" : null}*/}
                                {/*/>*/}

                            </Col>
                            <Col>
                                <Form.Label className={"show"}>Open on special days ?</Form.Label>
                                <Form.Check>
                                    {/*<label className={"show"}>*/}
                                    <Field type="checkbox" name="openSpecialDay"/>
                                    {/*{`${values.openSunday}`}*/}
                                    {/*</label>*/}
                                </Form.Check>
                                {/*<Form.Check*/}
                                {/*    type="checkbox"*/}
                                {/*    name="openSpecialDay"*/}
                                {/*    onChange={handleChange}*/}
                                {/*    onBlur={handleBlur}*/}
                                {/*    value={values.openSpecialDay}*/}
                                {/*    // className={touched.openSpecialDay && errors.openSpecialDay ? "has-error" : null}*/}

                                {/*/>*/}
                            </Col>
                        </Form.Row>
                        {/*<div className="buttons">*/}

                        {/*    <div style={{textAlign: "center"}}>*/}
                        {/*        {touched.openSpecialDay && errors.openSpecialDay ? (*/}
                        {/*            <div className="error-message"*/}
                        {/*                 style={{textAlign: "center"}}>{errors.openSpecialDay}</div>*/}
                        {/*        ) : null}*/}
                        {/*        {touched.openSunday && errors.openSunday ? (*/}
                        {/*            <div className="error-message"*/}
                        {/*                 style={{textAlign: "center"}}>{errors.openSunday}</div>*/}
                        {/*        ) : null}*/}
                        {/*    </div>*/}
                        {/*</div>*/}


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
                            <Form.Label className="labelField">Phone :</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phoneNumber}
                                className={touched.phoneNumber && errors.phoneNumber ? "has-error" : null}
                            />
                            {touched.phoneNumber && errors.phoneNumber ? (
                                <div className="error-message">{errors.phoneNumber}</div>
                            ) : null}
                        </Form.Group>
                        <Form.Group controlId="formWebsite">
                            <Form.Label className="labelField">Website :</Form.Label>
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
                            {latitude !== 0 ?
                                <SubmitButton variant="primary" type="submit" disabled={isSubmitting}>
                                    {modification ? "Confirm modification" : "Submit"}
                                </SubmitButton> :
                                <div><sub>Latitude and longitude are needed for submitting</sub><br/>
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