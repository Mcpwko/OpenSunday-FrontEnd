import React, {useState} from 'react';
import styled from 'styled-components';
import {Form, Button, Col} from 'react-bootstrap';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import "./FormPlace.css";

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
    font-size: 1.2em;
    font-weight: 400;
  }
  .error {
    border: 2px solid #FF6565;
  }
  .error-message {
    color: #FF6565;
    padding: .5em .2em;
    height: 1em;
    position: absolute;
    font-size: .8em;
  }
  h1 {
    color: #24B9B6;
    text-align: center;
    // padding-top: .5em;
  }
  .form-group {
    // margin-bottom: 2.5em;
  }
`;

const MyForm = styled(Form)`
  width: 90%;
  text-align: left;
  // padding-top: 2em;
  padding-bottom: 2em;
  @media(min-width: 786px) {
    width: 50%;
  }
`;

const MyButton = styled(Button)`
  background: #1863AB;
  border: none;
  font-size: 1.2em;
  font-weight: 400;
  &:hover {
    background: #1D3461;
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
        // specify the set of valid values for job type
        // @see http://bit.ly/yup-mixed-oneOf
        // .oneOf(
        //     ["designer", "development", "product", "other"],
        //     "Invalid Type"
        // )
        .test('Select a type of place', 'cannot be empty', value => value !== 'Please Select')
        .required("Type is required"),
    category: Yup.string()
        // specify the set of valid values for job type
        // @see http://bit.ly/yup-mixed-oneOf
        .oneOf(
            ["designer", "development", "product", "other"],
            "Invalid Category"
        )
        .required("Required"),
    description: Yup.string()
        .max(60, "Must be 60 characters or less")
        .required("Required"),
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
        // specify the set of valid values for job type
        // @see http://bit.ly/yup-mixed-oneOf
        .oneOf(
            ["designer", "development", "product", "other"],
            "Invalid Region"
        )
        .required("Required"),
    lat: Yup.number()
        .required("Required latitude, please click on 'get coordinates' or correct the address you wrote"),
    long: Yup.number()
        .required("Required longitude, please click on 'get coordinates' or correct the address you wrote"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Required"),
    website: Yup.string()
        .url("Invalid email address")
        .required("Required"),
    phone: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required("Required"),
    acceptedTerms: Yup.boolean()
        .required("Required")
        .oneOf([true], "You must accept the terms and conditions.")
});

// const Search = () => {
//     const [showResults, setShowResults] = React.useState(false)
//     const onClick = () => setShowResults(true)
//     return (
//         <div>
//             <input type="submit" value="Search" onClick={onClick}/>
//             {showResults ? <Results/> : null}
//         </div>
//     )
// }
//
// const Results = () => (
//     <div id="results" className="search-results">
//         Some Results
//     </div>
// )


export const ContactForm = (props) => {
    const [showForm, setShowForm] = useState(false);

    const displayForm = () => {
        setShowForm(true)
    }

    console.log(props);

    return (
        <Modal>
            {/*<Button onClick={displayForm}></Button>*/}
            {/*{showForm ?*/}
            <Container>
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
                        lat: props.latitude,
                        long: props.longitude,
                        email: "",
                        website: "",
                        phone: "",
                        acceptedTerms: false, // added for our checkbox
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        // When button submits form and form is in the process of submitting, submit button is disabled
                        setSubmitting(true);

                        // Simulate submitting to database, shows us values submitted, resets form
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            resetForm();
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
                                <Form.Control as="select" name="type">
                                    <option value="">Select a type of place</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="bar">Bar</option>
                                    <option value="park">Park</option>
                                    <option value="cinema">Cinema</option>
                                </Form.Control>
                                {touched.type && errors.type ? (
                                    <div className="error-message">{errors.type}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group controlId="formCategory">
                                <Form.Label>Category:</Form.Label>
                                <Form.Control as="select" name="category">
                                    <option value="">Select a category</option>
                                    <option value="chinese">Chinese</option>
                                    <option value="seafood">Seafood</option>
                                    <option value="indian">Indian</option>
                                    <option value="swiss">Swiss</option>
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
                                    className={touched.name && errors.name ? "has-error" : null}
                                />
                                {touched.name && errors.name ? (
                                    <div className="error-message">{errors.name}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group controlId="formAddress">
                                <Form.Label>Name of the place:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="Address of the place"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.address}
                                    className={touched.address && errors.address ? "has-error" : null}
                                />
                                {touched.address && errors.address ? (
                                    <div className="error-message">{errors.address}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Row>
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
                            </Form.Row>

                            <Form.Row>
                                <Col>
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lat"
                                        placeholder="Latitude"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lat}
                                        className={touched.lat && errors.lat ? "has-error" : null}
                                        disabled
                                    />
                                    {touched.lat && errors.lat ? (
                                        <div className="error-message">{errors.lat}</div>
                                    ) : null}
                                </Col>
                                <Col>
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="long"
                                        placeholder="Longitude"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.long}
                                        className={touched.long && errors.long ? "has-error" : null}
                                        disabled
                                    />
                                    {touched.long && errors.long ? (
                                        <div className="error-message">{errors.long}</div>
                                    ) : null}
                                </Col>
                            </Form.Row>


                            <Form.Group controlId="formEmail">
                                <Form.Label>Email :</Form.Label>
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
                            <Form.Group controlId="formBlog">
                                <Form.Label>Blog :</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="blog"
                                    placeholder="Blog URL"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.blog}
                                    className={touched.blog && errors.blog ? "has-error" : null}
                                />
                                {touched.blog && errors.blog ? (
                                    <div className="error-message">{errors.blog}</div>
                                ) : null}
                            </Form.Group>
                            {/*Submit button that is disabled after button is clicked/form is in the process of submitting*/}
                            <MyButton variant="primary" type="submit" disabled={isSubmitting}>
                                Submit
                            </MyButton>
                        </MyForm>
                    )}
                </Formik>
            </Container>
            {/*: null}*/}
        </Modal>
    );
}