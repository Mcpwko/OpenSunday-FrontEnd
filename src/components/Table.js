import React, {Fragment, useContext, useEffect, useState} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {selectFilter, textFilter} from "react-bootstrap-table2-filter";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import {Button, Col, Form, Spinner} from "react-bootstrap";
import styled from 'styled-components';
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import GetCategories, {GCats, GetAllCategories} from "../database/GetCategories";
import paginationFactory from "react-bootstrap-table2-paginator";
import {useHistory} from "react-router-dom";
import {Marker} from "react-leaflet";
import {switchIcon} from "./Icons";
import PlacesPopup from "./PlacesPopup";
import Select from "react-select";
import {useAlert} from "react-alert";
import {motion} from "framer-motion"
import {Formik, useField, useFormikContext} from "formik";
import GetTypes, {GTypes} from "../database/GetTypes";

const Container = styled.div`
    td, th, tr, table, text, tbody, thead{
        color:white;
    }
    
    .selection-cell, .selection-cell-header{
        display:none;
    }
    
    .table-hover tbody tr:hover{
        background-color:rgba(168, 249, 243, 0.19);
   }
`;

const {SearchBar} = Search;

let nameFilter;
let cityFilter;
let categoryFilter;
let typeFilter;
let oSFilter;
let oSdFilter;

/** Button to clear all fitlers*/
const ClearButton = props => {
    const handleClick = () => {
        props.onSearch("");
        props.clearAllFilter();
    };
    return (
        <Button
            variant="secondary"
            onClick={handleClick}
            style={{
                fontSize: "16px",
                padding: "5px",
                margin: "10px",
                height: "40px"
            }}
        >
            Clear all
        </Button>
    );
};

/**
 * Table
 * @returns {JSX.Element}
 */
export default function Table() {
    const [places, setPlaces] = useState([]);
    const authContext = useContext(Auth0Context);
    let history = useHistory();
    const alert = useAlert();

    const [categories, setTypes] = useState([]);
    const [types, setCategories] = useState([]);

    const [valueType, setValueType] = useState([]);
    const [valueCat, setValueCat] = useState([]);

    const [isCatEnable, setIsCatEnable] = useState(false);

    //Ref API to Table
    // let node;

    /** Retrieve places for the table, types and categories for the selects */
    useEffect(() => {
        alert.info("Loading data")

        async function getPlaces() {
            let places = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect
            );

            if (places && places.length > 0) {
                setPlaces(places)
                alert.success("Data loaded")
                alert.info("Click on a place to see it on the map")
            }
        }

        // async function getCategories() {
        //     let categories = await request(
        //         `${process.env.REACT_APP_SERVER_URL}${endpoints.categories}`,
        //         authContext.getAccessTokenSilently,
        //         authContext.loginWithRedirect
        //     );
        //
        //     if (categories && categories.length > 0) {
        //         setCategories(categories)
        //     }
        // }

        // async function getTypes() {
        //     let types = await request(
        //         `${process.env.REACT_APP_SERVER_URL}${endpoints.types}`,
        //         authContext.getAccessTokenSilently,
        //         authContext.loginWithRedirect
        //     );
        //
        //     if (types && types.length > 0) {
        //         setTypes(types)
        //     }
        // }

        getPlaces();
        // getCategories()
        //     .then(getTypes())
        //     .then(getPlaces())
        //     .then()

    }, []);

    /** Select a row in the table */
    const selectRow = {
        mode: "radio",
        clickToSelect: true,
        style: {
            backgroundColor: "rgba(5, 6, 70, 1)",
            color: "white"
        },
        onSelect: (row, isSelect, rowIndex, e) => {
            history.push(`/map/${row.idPlace}`);
        }
    };

    const FieldCategory = (props) => {
        const {values, touched, submitForm, setFieldValue} = useFormikContext();
        const [field, meta] = useField(props);
        const [disabled, setDisabled] = useState(true);

        useEffect(() => {
            if (values.type == "") {
                setDisabled(true)
            } else {
                setDisabled(false);
            }

            // console.log("VT="+values.type)
        }, [values.type]);

        return (
            <>
                <Form.Control {...props} {...field} disabled={disabled}>
                    {/*<Form.Control {...props} {...field}>*/}
                    {GetCategories(values.type)}
                    {/*{GCats(values.type)}*/}
                </Form.Control>
            </>
        )
    };

    const FieldType = (props) => {
        const {values, touched, submitForm, setFieldValue} = useFormikContext();
        const [field, meta] = useField(props);

        useEffect(() => {

            // setValueType(values.type)
            console.log("VT=" + values.type)
            console.log(values)
            console.log(meta)
            console.log(field)
            console.log(touched)


        }, [values.type]);

        return (
            <>
                <Form.Control {...props} {...field}>
                    {/*<Form.Control {...props} {...field}>*/}
                    {GetTypes()}
                    {/*{GTypes()}*/}
                </Form.Control>
            </>
        )
    };

    const FormSelect = () => (
        <div>
            <h1>Sign Up</h1>
            <Formik
                initialValues={{
                    type: '',
                    category: '',
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    alert(JSON.stringify(values, null, 2));
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
                    <div width={"50%"}>
                        <Form.Row style={{marginBottom: "1em"}}>
                            <Col>
                                <Form.Label className="show">Type of place:</Form.Label>
                                <FieldType
                                    as="select"
                                    name="type"
                                    value={values.type}
                                    onChange={handleChange}
                                    onBlur={handleBlur}

                                    // className={touched.type && errors.type ? "has-error" : null}>
                                >


                                </FieldType>
                                {/*{touched.type && errors.type ? (*/}
                                {/*    <div className="error-message">{errors.type}</div>*/}
                                {/*) : null}*/}
                                {/*</Form.Group>*/}
                            </Col>


                            <Col>
                                <Form.Label className="show">Category of place:</Form.Label>
                                {/**Field Category - Select in function of the type selected otherwise disabled*/}
                                <FieldCategory
                                    as="select"
                                    name="category"
                                    value={values.category}
                                    onChange={handleChange}
                                    // onBlur={handleBlur}
                                    // className={touched.category && errors.category ? "has-error" : null}
                                    disabled={isCatEnable}
                                >


                                    {/*{GetCategories()}*/}
                                    {/*<option value="">Select a category of place</option>*/}
                                    {/*<option value="restaurant">Restaurant</option>*/}

                                </FieldCategory>
                                {/*{touched.category && errors.category ? (*/}
                                {/*    <div className="error-message">{errors.category}</div>*/}
                                {/*) : null}*/}
                            </Col>
                        </Form.Row>
                    </div>
                )}


                {/*<Form>*/}
                {/*    <label htmlFor="firstName">First Name</label>*/}
                {/*    <Field id="firstName" name="firstName" placeholder="Jane" />*/}

                {/*    <label htmlFor="lastName">Last Name</label>*/}
                {/*    <Field id="lastName" name="lastName" placeholder="Doe" />*/}

                {/*    <label htmlFor="email">Email</label>*/}
                {/*    <Field*/}
                {/*        id="email"*/}
                {/*        name="email"*/}
                {/*        placeholder="jane@acme.com"*/}
                {/*        type="email"*/}
                {/*    />*/}
                {/*    <button type="submit">Submit</button>*/}
                {/*</Form>*/}
            </Formik>
        </div>
    );

    const selectOptions = {
        true: 'Open',
        false: 'Close'
    };


    /** Columns, data an filters of the table */
    const columns = [
        {
            dataField: "name",
            text: "Name",
            filter: textFilter({
                getFilter: filter => {
                    nameFilter = filter;
                }
            }),
            sort: true
        },
        {
            dataField: "locationSet.citySet.name",
            text: "City",
            filter: textFilter({
                getFilter: filter => {
                    cityFilter = filter;
                }
            }),
            sort: true
        },
        {
            dataField: "typeSet.name",
            text: "Type",
            filter: textFilter({
                getFilter: filter => {
                    typeFilter = filter;
                }
            }),
            sort: true
        },
        {
            dataField: "typeSet.categorySet[0].name",
            text: "Category",
            filter: textFilter({
                getFilter: filter => {
                    categoryFilter = filter;
                }
            }),
            sort: true
        },
        {
            dataField: "isOpenSunday",
            text: "Open on Sunday",
            filter: selectFilter({
                getFilter: filter => {
                    oSFilter = filter;
                }
                ,options:selectOptions
            }),
            sort: true,
            formatter:(value, row) => (
                <span>
            {value ? '✔' : '❌'}
          </span>
            )
        },
        {
            dataField: "isOpenSpecialDay",
            text: "Open on Special days",
            filter: selectFilter({
                getFilter: filter => {
                    oSdFilter = filter;
                }
                ,options:selectOptions
            }),
            sort: true,
            formatter:(value, row) => (
                <span>
            {value ? '✔' : '❌'}
          </span>
            )
        }
    ];

    /** Clear all filters*/
    function clearAllFilter() {
        nameFilter("");
        cityFilter("");
        categoryFilter("");
        typeFilter("");
        oSFilter();
        oSdFilter();
    }

    // const handleGetCurrentFilter = () => {
    //     console.log(node.filterContext.currFilters);
    // }

    // function handleChange(value, source) {
    //     if (source === "type") {
    //         setValueType(value)
    //     }
    //     if (source === "cat") {
    //         setValueCat(value)
    //     }
    // }

    function handleClick() {
        let x = valueType;
        typeFilter(x);
    };


    return (
        <Container>
            <motion.div
                animate={{scale: 1.5}}
                transition={{duration: 2}}
            >
                <h1>Places search</h1>
            </motion.div>
            <motion.div
                animate={{scale: 1.5}}
                transition={{duration: 5}}
            >
                <h3>Click on a row to show the place on the map</h3>
            </motion.div>

            {/*<Select*/}
            {/*    options={types}*/}
            {/*    value={valueType}*/}
            {/*    onChange={value => handleChange(value, "type")}*/}
            {/*    // defaultValue={{ label: 2002, value: 2002 }}*/}
            {/*/>*/}
            {/*/!**Categories*!/*/}
            {/*/!*{console.log(categories.name)}*!/*/}
            {/*{console.log(categories)}*/}
            {/*<Select*/}
            {/*    options={optionsSelect}*/}
            {/*    value={valueCat}*/}
            {/*    onChange={value => handleChange(value, "cat")}*/}
            {/*    // defaultValue={{ label: 2002, value: 2002 }}*/}
            {/*/>*/}
            {/*{categories && categories.length > 0 && (*/}
            <FormSelect></FormSelect>
            {/*)}*/}
            {places && places.length > 0 ? (
                <ToolkitProvider
                    bootstrap4
                    keyField="name"
                    data={places}
                    columns={columns}
                    search
                >
                    {props => (
                        <div>
                            {/**Types*/}

                            {/*<MySearch></MySearch>*/}
                            <SearchBar
                                {...props.searchProps}
                                style={{width: "400px", height: "40px"}}
                            />
                            <ClearButton
                                {...props.searchProps}
                                clearAllFilter={clearAllFilter}
                            />
                            {/*{console.log("DD%" + ddt)}*/}
                            {/*{console.log("TYPES=>" + types)}*/}

                            <BootstrapTable
                                // ref={ n => node = n }
                                {...props.baseProps}
                                filter={filterFactory()}
                                noDataIndication="No data found"
                                striped
                                hover
                                condensed
                                pagination={paginationFactory()}
                                selectRow={selectRow}
                                // headerWrapperClasses="thead-dark"
                                // classes="table-striped table-hover"
                            />
                        </div>
                    )}
                </ToolkitProvider>
            ) : <Spinner animation="border" variant="light" role="status" style={{
                width: "8rem",
                height: "8rem"
            }}><span
                className="sr-only">Loading...</span></Spinner>}

            {/*{node != undefined &&*/}
            <button className="btn btn-lg btn-primary" onClick={handleClick}> filter columns by 0</button>
            {/*}*/}

        </Container>
    );
}
