import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';
import _ from 'lodash';
import "./Table.css"
import styled from "styled-components";
import {Button} from "react-bootstrap";


// import 'react-select/dist/react-select.css'

const MyBootstrapTable = styled(BootstrapTable)`
color:white;
td, th{
color:white;
}
`;

const data = [
    {"Id": 1, "status": 0, "type": "Type 1"},
    {"Id": 2, "status": 1, "type": "Type 2"},
    {"Id": 3, "status": 0, "type": "Type 3"},
    {"Id": 4, "status": 1, "type": "Type 2"},
    {"Id": 5, "status": 0, "type": "Type 3"},
    {"Id": 6, "status": 1, "type": "Type 1"},
]

const statusOption = [
    {"value": 1, "label": "1"},
    {"value": 0, "label": "0"}
]

const typeOption = [
    {"value": "Type 1", "label": "Type 1"},
    {"value": "Type 2", "label": "Type 2"},
    {"value": "Type 3", "label": "Type 3"}
]

export default class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectOptions: {
                type: typeOption,
                status: statusOption
            },
            filter: {
                type: [],
                status: []
            },
            filterKey: ""
        }
        this.handleMultiFilterChange = this.handleMultiFilterChange.bind(this);
        this.createCustomFilter = this.createCustomFilter.bind(this);
        this.filter = this.filter.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    componentDidMount() {
    }

    handleMultiFilterChange(updateItem, key, filterHandler) {
        let filter = this.state.filter;
        filter[key] = updateItem;
        this.setState({
            filter: filter,
            filterKey: key
        }, function () {
            console.log(this.state.filterKey)
            if (filter[key].length === 0) {
                filterHandler();
            } else {
                filterHandler({callback: this.filter})
            }
        });
    }

    onFilterChange(filterObj) {
        console.log(filterObj)
    }


    filter(targetValue) {
        // HERE: TargetValue always be first Column which have been filtered
        console.log(targetValue);
        return _.indexOf(_.map(this.state.filter[this.state.filterKey], x => x.value), targetValue) !== -1;
    }

    createCustomFilter(filterHandler, parameter) {
        return (
            <Select multi={true} value={this.state.filter[parameter.key]}
                    options={this.state.selectOptions[parameter.key]}
                    onChange={(item) => this.handleMultiFilterChange(item, parameter.key, filterHandler)}/>
        );
    }

    render() {
        const options = {
            onFilterChange: this.onFilterChange
        }
        return (
            <div>
                <MyBootstrapTable version="4" ref="table" data={data} options={options}>
                    <TableHeaderColumn dataSort width='70' headerAlign='center' dataField='Id'
                                       isKey>Id</TableHeaderColumn>
                    <TableHeaderColumn filter={{
                        type: 'CustomFilter',
                        getElement: this.createCustomFilter,
                        customFilterParameters: {key: 'status'}
                    }}
                                       dataSort headerAlign='center' dataField='status'>Status</TableHeaderColumn>
                    <TableHeaderColumn filter={{
                        type: 'CustomFilter',
                        getElement: this.createCustomFilter,
                        customFilterParameters: {key: 'type'}
                    }}
                                       dataSort headerAlign='center' dataField='type'>Type</TableHeaderColumn>
                </MyBootstrapTable>
            </div>
        );
    }
}