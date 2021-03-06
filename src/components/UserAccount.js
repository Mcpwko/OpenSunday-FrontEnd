import React, {useContext, useEffect, useState} from "react";
import "./Place.css";
import {useAuth0} from "@auth0/auth0-react";
import {SubmitButton} from "./FormPlace";
import {Formik} from "formik";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import * as Yup from "yup";
import styled from 'styled-components';
import ConfirmDialog from "../components-reusable/ConfirmDialog";
import {useAlert} from "react-alert";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {UserContext} from "../context/UserContext";
import BootstrapTable from 'react-bootstrap-table-next';
import {faBan, faEdit, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import filterFactory from "react-bootstrap-table2-filter";
import {useHistory} from "react-router-dom";

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
  h2 {
    text-align: center;
    font-size: 1em;
    font-weight: 400;
    padding: 0.8em;
    color: #24B9B6;
  }
  sub {
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
    ;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [places, setPlaces] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const [reportChange, setReportChange] = useState([false]);
    /*Context*/
    const userContext = useContext(UserContext);
    /*Hooks*/
    const authContext = useAuth0();
    const alert = useAlert()
    let history = useHistory();

//Date formatter in table
    function dateFormatter(cell) {

        return (
            <div>{new Date(cell).getDate()}.{new Date(cell).getMonth() + 1}.{new Date(cell).getFullYear()}</div>

        );
    }

    //Show edit or delete icon
    function editDeleteFormatter(cell, row) {
        if (row.isForEdit) {
            return (
                <div><FontAwesomeIcon icon={faEdit}/></div>
            );
        } else {
            return (
                <div><FontAwesomeIcon icon={faBan}/></div>
            );
        }
    }

    //Action for go to the place on map
    function editDeleteClick(place) {
        history.push(`/map/${place.idPlace}`)
    }

    //Button for go to the place on map
    function editDeleteCheck(reportSet, place) {
        return (
            <div>
                <Button onClick={() => editDeleteClick(place)}><FontAwesomeIcon icon={faMapMarkerAlt}/></Button>
            </div>
        )
    }

    //Delete a report and reload the table
    async function handleClick(row) {
        await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.changeStatus}${row.idReport}`,
            authContext.getAccessTokenSilently
        );
        setReportChange(true);
        setPlaces([]);
        alert.success("The report has been processed !");
        alert.info("Reloading data")
    }

    //Button for delete the report
    function changeStatus(cell, row) {
        return (
            <div>
                <button className="changeStatus" onClick={() => handleClick(row)}><span>❌</span></button>
            </div>
        )
    }

    //Columns of the table
    const columns = [{
        dataField: 'idReport',
        text: 'Id Report',
        headerStyle: {
            color: '#24B9B6'
        }
    }, {
        dataField: 'comment',
        text: 'Comment',
        headerStyle: {
            color: '#24B9B6'
        }
    }, {
        dataField: 'userSet.pseudo',
        text: 'pseudo',
        headerStyle: {
            color: '#24B9B6'
        }
    }, {
        dataField: 'reportDate',
        text: 'Date',
        sort: true,
        formatter: dateFormatter,
        headerStyle: {
            color: '#24B9B6'
        }
    }, {
        text: 'Delete or Edit',
        formatter: editDeleteFormatter,
        headerStyle: {
            color: '#24B9B6'
        }
    }, {
        dataField: 'status',
        text: 'Status',
        formatter: changeStatus,
        headerStyle: {
            color: '#24B9B6'
        }
    }];

    //Sorted by report date
    const defaultSorted = [{
        dataField: 'reportDate',
        order: 'desc'
    }]

    //If no report for the place
    const NoDataIndication = () => (
        <div className="Spinner">
            <h1 style={{color: '#24B9B6'}}>No report</h1>
        </div>
    )

    //Load/Reload the places
    useEffect(() => {
        async function getPlaces() {

            //Get places
            let place = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
                authContext.getAccessTokenSilently
            );

            if (place != null) {
                setPlaces(place);
            }

        }

        getPlaces();
        setReportChange(false);
    }, [reportChange]);

    //Delete account
    async function deleteAccount() {
        // Delete account
        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.user}${'/' + userContext.user.idUser}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
            },
        });

        // Tell the user
        setShowDelete(true);
        //Redirect user
        setInterval(function () {
            authContext.logout({returnTo: window.location.origin})
        }, 3000)
    }

    //Change the pseudo
    const changePseudo = async (values) => {
        const token = await authContext.getAccessTokenSilently();
        //Look if the pseudo is available

        let check = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.checkUser}${values.pseudo}`,
            authContext.getAccessTokenSilently
        );

        console.log(check);

        if (check == 1) {
            //IF the pseudo is not available, there is an alert
            alert.show("The pseudo " + values.pseudo + " is not available");

        } else {

            //If the pseudo is available, we save it in database

            await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.user}${'/' + userContext.user.idUser}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${await authContext.getAccessTokenSilently()}`,
                    'Content-Type': "application/json",
                }, body: JSON.stringify({
                    idUser: userContext.user.idUser,
                    email: userContext.user.email,
                    pseudo: values.pseudo,
                    createdAt: userContext.user.createdAt,
                    status: userContext.user.status,
                    idAuth0: userContext.user.idAuth0,
                    idUserType: userContext.user.idUserType
                })
            });
            userContext.user.pseudo = values.pseudo;

            alert.success("The pseudo has been modified !");
        }

    }

    const hide = () => {
        //Block interaction of the user
    }

    return (
        <Container style={{width: "100%"}}>
            <Modal show={showDelete} onHide={hide}>
                <Modal.Header>
                    <Modal.Title>Deleted</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your account has been successfully deleted ! You will be redirected in 3 sec !</Modal.Body>
            </Modal>

            <h1>Account settings</h1>

            <Formik
                initialValues={{
                    pseudo: "YourPseudo",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, {setSubmitting, resetForm}) => {
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
            {/*============================== REPORT ==================================*/}
            {userContext.user != null && userContext.user.idUserType == 3 ?
                <>
                    <div>
                        {places && places.length > 0 ?
                            <ul style={{listStyleType: "none", padding: "0", margin: "0"}}>
                                {places != null ? places.map((place) => (
                                    <li key={place.idPlace}>
                                        <h3 style={{
                                            borderRadius: '0.25em',
                                            textAlign: 'center',
                                            color: '#24B9B6',
                                            border: '1px solid #24B9B6',
                                            padding: '0.5em'
                                        }}>{place.name} | <span>{place.reportSet.filter(x => x.status == true).length} report(s)</span>
                                            <span>{editDeleteCheck(place.reportSet, place)}</span></h3>
                                        <BootstrapTable
                                            rowStyle={{color: '#24B9B6'}}
                                            bootstrap4
                                            keyField='idReport'
                                            filter={filterFactory()}
                                            noDataIndication={() => <NoDataIndication/>}
                                            data={place.reportSet.filter(x => x.status == true)}
                                            columns={columns}
                                            defaultSorted={defaultSorted}/>
                                    </li>)) : null}
                            </ul> : <Spinner animation="border" variant="light" role="status"
                                             style={{width: "8rem", height: "8rem"}}><span
                                className="sr-only">Loading...</span></Spinner>}
                    </div>
                </> : null}
        </Container>
    );
}
