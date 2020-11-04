import React, {Fragment, useContext, useEffect, useState} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {selectFilter, textFilter} from "react-bootstrap-table2-filter";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import {Button, Spinner} from "react-bootstrap";
import styled from 'styled-components';
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import GetCategories, {GetAllCategories} from "../database/GetCategories";
import paginationFactory from "react-bootstrap-table2-paginator";
import {useHistory} from "react-router-dom";
import {Marker} from "react-leaflet";
import {switchIcon} from "./Icons";
import PlacesPopup from "./PlacesPopup";
import Select from "react-select";
import {useAlert} from "react-alert";

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
            Clear
        </Button>
    );
};

function Table() {
    const [places, setPlaces] = useState([]);
    const authContext = useContext(Auth0Context);
    const [categories, setTypes] = useState([]);
    const [types, setCategories] = useState([]);
    let history = useHistory();
    const alert = useAlert();

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

        async function getCategories() {
            let categories = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.categories}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect
            );

            if (categories && categories.length > 0) {
                setCategories(categories)
            }
        }

        async function getTypes() {
            let types = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.types}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect
            );

            if (types && types.length > 0) {
                setTypes(types)
            }
        }

        getCategories()
            .then(getTypes())
            .then(getPlaces())
            .then()

    }, []);

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
            filter: textFilter({
                getFilter: filter => {
                    oSFilter = filter;
                }
            }),
            sort: true
        },
        {
            dataField: "isOpenSpecialDay",
            text: "Open on Special days",
            filter: textFilter({
                getFilter: filter => {
                    oSdFilter = filter;
                }
            }),
            sort: true
        }
    ];

    function clearAllFilter() {
        nameFilter("");
        cityFilter("");
        categoryFilter("");
        typeFilter("");
        oSFilter("");
        oSdFilter("");
    }

    return (
        <Container>
            <h1>Places search</h1>

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
                            {/*{console.log("DD%" + ddt)}*/}
                            {/*{console.log("TYPES=>" + types)}*/}
                            <BootstrapTable
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
            ) : <Spinner animation="border" variant="light" role="status" style={{width: "8rem", height: "8rem"}}><span
                className="sr-only">Loading...</span></Spinner>}
        </Container>
    );

}

export default Table;
