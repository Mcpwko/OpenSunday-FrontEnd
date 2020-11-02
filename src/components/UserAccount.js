import React, {useContext, useState} from "react";
import "./Place.css";
import {Auth0Context} from "@auth0/auth0-react";
import {SubmitButton} from "./FormPlace";
import {Formik} from "formik";
import {Form, Button} from "react-bootstrap";
import * as Yup from "yup";
import styled from 'styled-components';
import ConfirmDialog from "../components-reusable/ConfirmDialog";
import {useAlert} from "react-alert";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {UserContext} from "../context/UserContext";
import moment from "moment";

const Container = styled.div`
  text-align: center;
  color: snow;
  @media(min-width: 786px) {
    width: 60%;
  }
  label {
    color: #24B9B6;
  }
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
  @media(min-width: 786px) {
    width: 50%;
  }
`;

const DeleteButton = styled(Button)`
  background: red;
  border: none;
  margin : 2em;
  font-size: 0.8em;
  font-weight: 200;
  &:hover {
    background: darkred;
  }
`;


/**
 * Validation schema for Yup (Validation for the form with Formik)
 */
const validationSchema = Yup.object().shape({
    pseudo: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Please enter a correct value")
});

export default function UserAccount(props) {
    const alert = useAlert();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const authContext = useContext(Auth0Context);
    const userContext = useContext(UserContext);

    function deleteAccount() {
        // alert("THIS IS THE FUNCTION DELETE ACCOUNT");
        alert.show("This is the delete method to implement");

        // Unlog the user

        // Redirect user to home page

        // Delete account

        // Tell the user
        alert.success("The account has been successfully deleted");

    }

        let changePseudo = async (values) => {

            //Get all users
            let users = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.user}`,
                authContext.getAccessTokenSilently
            );

            console.log(users);

            //Look if the pseudo is available
            let pseudoAvailable = users.map(user => values.pseudo === user.pseudo);

            //If the pseudo is available, we save it in database
            if(pseudoAvailable == true){

                let token = authContext.getAccessTokenSilently();

                await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.user}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        'Content-Type': "application/json",
                    }, body: JSON.stringify({
                        email: userContext.user.email,
                        pseudo: values.pseudo,
                        createdAt: userContext.user.createdAt,
                        status: userContext.user.createdAt,
                        idAuth0: userContext.user.idAuth0,
                        idUserType: userContext.user.idUserType
                    })
                });

                alert.success("The pseudo is modify !");
            } else {
                alert.show("The pseudo is not available");
            }

        };

    // const authContext = useContext(Auth0Context);
    // const [value, setValue] = useState("");
    //
    // let pseudo = "test";

    return (

        <Container style={{width: "100%"}}>

            <h1>Account settings</h1>

            <Formik
                initialValues={{
                    pseudo: "GetPseudo",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    // When button submits form and form is in the process of submitting, submit button is disabled
                    setSubmitting(true);
                    //Change the pseudo
                    changePseudo(values);
                    // Simulate submitting to database, shows us values submitted, resets form
                    setTimeout(() => {

                        alert.show(JSON.stringify(values, null, 2));
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
                      isSubmitting,
                  }) => (
                    <MyForm onSubmit={handleSubmit} style={{width: "100%"}}>
                        <Form.Group controlId="formPseudo">
                            <Form.Label className={"show"}>Edit your pseudo</Form.Label>
                            <Form.Control
                                style={{textAlign: "center"}}
                                type="text"
                                name="pseudo"
                                placeholder="Pseudo"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.pseudo}
                                className={touched.pseudo && errors.pseudo ? "has-error" : null}
                            />
                            {touched.pseudo && errors.pseudo ? (
                                <div className="error-message">{errors.pseudo}</div>
                            ) : null}
                        </Form.Group>

                        <div className="buttons">
                            {/*============================== SUBMIT BUTTON ==================================*/}
                            {/*Submit button that is disabled after button is clicked/form is in the process of submitting*/}
                            <SubmitButton variant="primary" type="submit" disabled={isSubmitting}
                                          style={{marginTop: "1em"}}>
                                Change pseudo
                            </SubmitButton>
                        </div>

                        <div className="buttons">
                            {/*============================== DELETE BUTTON ==================================*/}

                            <DeleteButton variant="secondary" active={confirmOpen}
                                          onClick={() => setConfirmOpen(true)}>
                                Delete account
                            </DeleteButton>
                            <ConfirmDialog
                                title="WARNING: This account will be deleted"
                                open={confirmOpen}
                                setOpen={setConfirmOpen}
                                onConfirm={deleteAccount}
                            >
                                Are you sure you want to delete this account?<br/>
                                This action cannot be undone!<br/>
                                All data linked to your account will be lost.
                            </ConfirmDialog>
                        </div>
                    </MyForm>
                )}
            </Formik>
        </Container>
    );
}
