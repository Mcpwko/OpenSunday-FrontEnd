import React, {useContext, useEffect, useState} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {selectFilter, textFilter} from "react-bootstrap-table2-filter";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import {Button, Spinner} from "react-bootstrap";
import styled from 'styled-components';
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import paginationFactory from "react-bootstrap-table2-paginator";
import {useHistory} from "react-router-dom";
import {useAlert} from "react-alert";
import {GetAllTypes} from "../database/GetTypes";

const Container = styled.div`
    td, th, tr, table, text, tbody, thead{
        color: #e6f9ff;
        width: 100%
        height:100%
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
   }
   h3 {
        font-style: italic;
        text-align: center;
        font-size: 1.4em;
        color: #00ace6;
  }
  a {
        background:black;
  }
  .page-item.active .page-link{
        background-color: #24B9B6;
  }
  .page-link{
        color: #24B9B6;
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

        getPlaces();

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
                // options: typeOption
                getFilter: filter => {
                    typeFilter = filter;
                }
                , options: typeOption
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

    return (
        <Container>
            <h1>Places search</h1>

            <h3>Click on a row to show the place on the map</h3>

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
