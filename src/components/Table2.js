import React, {useContext, useEffect, useState} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {selectFilter, textFilter} from "react-bootstrap-table2-filter";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import {Button} from "react-bootstrap";
import styled from 'styled-components';
import {GetAllPlaces} from "../database/GetPlaces";
import {Auth0Context} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import * as Comparator from "react-bootstrap-table2-filter";
import {GetAllCategories} from "../database/GetCategories";
import {GetAllTypes} from "../database/GetTypes";
// import filterFactory, { multiSelectFilter } from 'react-bootstrap-table2-filter';

const Container = styled.div`

td, th, tr, table, text, tbody, thead{
    color:white;
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
    let [places, setPlaces] = useState([]);
    const authContext = useContext(Auth0Context);
    let [categories, setTypes] = useState(GetAllCategories());
    let [types, setCategories] = useState(GetAllTypes());



    //Get places for DB
    useEffect(() => {
        async function getPlaces() {

            let places = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
                authContext.getAccessTokenSilently,
                authContext.loginWithRedirect
            );


            if (places && places.length > 0) {
                console.log(places);
                setPlaces(places);

            }
            // setCategories(GetAllCategories())
            // setTypes(GetAllTypes())
        }

        getPlaces().then(r => console.log(places)).then(y=> console.log("THEN"));

    }, []);

    console.log(places);


    const columns = [
        {
            dataField: "name",
            text: "Name",
            filter: textFilter({
                getFilter: filter => {
                    nameFilter = filter;
                }
            })
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
            // dataField: "typeSet.name",
            // text: "Type",
            // formatter: cell => types[cell],
            // filter: selectFilter({
            //         options: types,
            //         className: 'test-classname',
            //         withoutEmptyOption: true,
            //         defaultValue: 2,
            //         comparator: Comparator.LIKE, // default is Comparator.EQ
            //         style: { backgroundColor: 'pink' },
            //         getFilter: (filter) => { // qualityFilter was assigned once the component has been mounted.
            //             typeFilter = filter;
            //         },
            //         onFilter: (filterValue) => {
            //             //...
            //         }
            // })






            // filter: textFilter({
            //     getFilter: filter => {
            //         typeFilter = filter;
            //     }
            // })
        },
        {
            dataField: "typeSet.categorySet[0].name",
            text: "Category",
            filter: textFilter({
                getFilter: filter => {
                    categoryFilter = filter;
                }
            })
        },
        {
            dataField: "isOpenSunday",
            text: "Open on Sunday",
            filter: textFilter({
                getFilter: filter => {
                    oSFilter = filter;
                }
            })
        },
        {
            dataField: "isOpenSpecialDay",
            text: "Open on Special days",
            filter: textFilter({
                getFilter: filter => {
                    oSdFilter = filter;
                }
            })
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

    // const products = [
    //     {
    //         name: "apple",
    //         price: 100,
    //         stock: 10,
    //         origin: "japan"
    //     },
    //     {
    //         name: "orange",
    //         price: 150,
    //         stock: 35,
    //         origin: "spain"
    //     },
    //     {
    //         name: "pineapple",
    //         price: 300,
    //         stock: 4,
    //         origin: "america"
    //     }
    // ];


    return (
        <Container>
            <h1>Clear search bar and filter</h1>
            {/*{places && places.length > 0 && (*/}
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
                            {console.log("TYPES=>"+types)}
                            <BootstrapTable
                                {...props.baseProps}
                                filter={filterFactory()}
                                noDataIndication="There is no solution"
                                striped
                                hover
                                condensed
                            />
                        </div>
                    )}
                </ToolkitProvider>
            {/*)}*/}
        </Container>
    );

}

export default Table;
