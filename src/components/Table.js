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
import GetTypes, {GetAllTypes, GTypes} from "../database/GetTypes";

const Container = styled.div`
    td, th, tr, table, text, tbody, thead{
        // color:white;
        color: #e6f9ff;
    }
    .selection-cell, .selection-cell-header{
        display:none;
    }
    .table-hover tbody tr:hover{
        background-color:rgba(168, 249, 243, 0.19);
   }
   h1{
       color: #24B9B6;
       text-align: center;
       padding:0.3em;    
   }
   h3 {
        font-style: italic;
        text-align: center;
        font-size: 1em;
        font-weight: 400;
        padding: 0.8em;
        color: #00ace6;
  }
`;

const {SearchBar} = Search;

let nameFilter;
let cityFilter;
let categoryFilter;
let typeFilter;
let oSFilter;
let oSdFilter;

/** Button to clear all filters */
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


    const selectOptions = {
        true: 'Open',
        false: 'Close'
    };

    const typeOption = optionType();

    function optionType() {
        let x = GetAllTypes()
        let fil = []

        x.map((typeDB) => (
            fil.push({label: typeDB.name, value: typeDB.name})
        ))

        return fil;

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
            filter: selectFilter({
                options: typeOption
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
                , options: selectOptions
            }),
            sort: true,
            formatter: (value, row) => (
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
                , options: selectOptions
            }),
            sort: true,
            formatter: (value, row) => (
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
        typeFilter();
        oSFilter();
        oSdFilter();
    }


    function handleClick() {
        oSFilter("true");
        oSdFilter("true");
    };

    // const CaptionElement = () => <h3 style={{ borderRadius: '0.25em', textAlign: 'center', color: 'purple', border: '1px solid purple', padding: '0.5em' }}>Component as Header</h3>;


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

            {/*<button style={{display:"flex", textAlign:"center"}}className="btn btn-lg btn-primary" onClick={handleClick}>Apply filter: only open on Sundays and*/}
            {/*    special days</button>*/}


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

                            <SearchBar
                                {...props.searchProps}
                                style={{width: "400px", height: "40px"}}
                            />
                            <ClearButton
                                {...props.searchProps}
                                clearAllFilter={clearAllFilter}
                            />

                            <BootstrapTable

                                {...props.baseProps}
                                filter={filterFactory()}
                                noDataIndication="No data found"
                                striped
                                hover
                                condensed
                                pagination={paginationFactory()}
                                selectRow={selectRow}
                                bordered={false}


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


        </Container>
    );
}
