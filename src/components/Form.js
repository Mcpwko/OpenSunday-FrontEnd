/* Partially retrieved on: https://formik.org*/
import React, {useEffect} from "react";
import {Formik, Form, useField, useFormikContext} from "formik";
import * as Yup from "yup";
import "./Form.css";
import "./FormModal.css";
import "./Form-custom.css";
import styled from "@emotion/styled";

// Validation expression for phone number more or less international, covers the major part of phone number
const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/

/**
 * Allows to create our customisable input field
 * @param label
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const MyTextInput = ({label, ...props}) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

/**
 * Allows to create our customisable input for checkboxes
 * @param children
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const MyCheckbox = ({children, ...props}) => {
    const [field, meta] = useField({...props, type: "checkbox"});
    return (
        <>
            <label className="checkbox">
                <input {...field} {...props} type="checkbox"/>
                {children}
            </label>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

// Styled components
const StyledSelect = styled.select`
  color: var(--blue);
`;

const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: var(--red-600);
  width: 400px;
  margin-top: 0.25rem;
  &:before {
    content: "❌ ";
    font-size: 10px;
  }
  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`;

const StyledLabel = styled.label`
  margin-top: 1rem;
`;

const MySelect = ({label, ...props}) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and also replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <StyledLabel htmlFor={props.id || props.name}>{label}</StyledLabel>
            <StyledSelect {...field} {...props} />
            {meta.touched && meta.error ? (
                <StyledErrorMessage>{meta.error}</StyledErrorMessage>
            ) : null}
        </>
    );
};

// And now we can use these
export const SignupForm = () => {
    return (
        <>
            <h2>Modal</h2>

            {/*/!*Trigger/Open The Modal*!/*/}
            {/*<button id="myBtn">Open Modal</button>*/}

            {/*<div id="myModal" className="modal">*/}

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
                    lat: "",
                    long: "",
                    email: "",
                    website: "",
                    phone: "",
                    acceptedTerms: false, // added for our checkbox
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .max(15, "Must be 15 characters or less")
                        .required("Required"),
                    type: Yup.string()
                        // specify the set of valid values for job type
                        // @see http://bit.ly/yup-mixed-oneOf
                        .oneOf(
                            ["designer", "development", "product", "other"],
                            "Invalid Type"
                        )
                        .required("Required"),
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
                        .oneOf([true], "You must accept the terms and conditions."),
                })}
                onSubmit={async (values, {setSubmitting}) => {
                    await new Promise(r => setTimeout(r, 500));
                    setSubmitting(false);
                }}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h1>Create a place</h1>
                        <span className="close">&times;</span>

                    </div>
                    <div className="modal-body">
                        <Form>

                            {/*<div className="form-row">*/}

                            <div className="form-group">
                                <MyTextInput
                                    label="Name"
                                    name="name"
                                    type="text"
                                    placeholder="Name of the place"
                                />
                                {/*</div>*/}

                                {/*<div className="form-group">*/}
                                <MySelect label="Type" name="type">
                                    <option value="">Select a type of place</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="bar">Bar</option>
                                    <option value="park">Park</option>
                                    <option value="cinema">Cinema</option>
                                </MySelect>
                                {/*</div>*/}

                                {/*<div className="form-group">*/}
                                <MySelect label="Category" name="category">
                                    <option value="">Select a category</option>
                                    <option value="chinese">Chinese</option>
                                    <option value="seafood">Seafood</option>
                                    <option value="indian">Indian</option>
                                    <option value="swiss">Swiss</option>
                                </MySelect>
                            </div>

                            <div className="form-group">
                                <MyTextInput
                                    label="Description"
                                    name="description"
                                    type="text"
                                    placeholder="Enter a description of some additional features provided by the place"
                                    id="descriptionInput"
                                />
                            </div>

                            <div className="form-group">
                                <MyTextInput
                                    label="Address"
                                    name="address"
                                    type="text"
                                    placeholder="Address and number (Ex. Rue des Pives 9)"
                                />
                                {/*</div>*/}

                                {/*<div className="form-group">*/}
                                <MyTextInput
                                    label="Zip"
                                    name="zip"
                                    type="text"
                                    placeholder="Zip code"
                                />
                                {/*</div>*/}

                                {/*<div className="form-group">*/}
                                <MyTextInput
                                    label="City"
                                    name="city"
                                    type="text"
                                    placeholder="City"
                                />
                                {/*</div>*/}

                                {/*<div className="form-group">*/}
                                <MySelect label="Region" name="region">
                                    <option value="">Select a region</option>
                                    <option value="valais">Valais</option>
                                    <option value="vaud">Vaud</option>
                                    <option value="fribourg">Fribourg</option>
                                    <option value="geneve">Genève</option>
                                </MySelect>
                            </div>


                            <button className="formButton" type="getCoordinates">Get the coordinates</button>

                            <div className="form-group">
                                <MyTextInput
                                    label="Lat"
                                    name="lat"
                                    type="text"
                                    placeholder="Latitude, retrieved with 'Get the coordinates'"
                                    disabled
                                />

                                <MyTextInput
                                    label="Long"
                                    name="long"
                                    type="text"
                                    placeholder="Longitude, retrieved with 'Get the coordinates'"
                                    disabled
                                />
                            </div>

                            <text>Give us more information about the place</text>

                            <div className="form-group">
                            <MyTextInput
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="Email address"
                            />

                            <MyTextInput
                                label="Website"
                                name="website"
                                type="text"
                                placeholder="Website"
                            />

                            <MyTextInput
                                label="Phone"
                                name="phone"
                                type="text"
                                placeholder="Phone number (Ex. +41274559512)"
                            />
                            </div>

                            <div className="form-group">
                                <MyCheckbox name="acceptedTerms">
                                    I accept the terms and conditions
                                </MyCheckbox>
                            </div>
                            {/*</div>*/}


                            <div className="modal-footer">
                                <button className="formButton" type="submit">Submit</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Formik>
            {/*</div>*/}


        </>
    )
        ;
};