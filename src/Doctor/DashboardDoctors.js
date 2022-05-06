import React, { Component, useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { PatientInfo } from "./PatientComponent"
import { api } from '../helpers/api/api';


export class DashboardDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        localStorage.removeItem('newPatient');
        //     api.getAll("/GetPatients")
        //         .then((response) => {
        //             if (response.status === 200) {
        //                 this.setState({
        //                     isLoaded: true,
        //                     items: response.data
        //                 });
        //             }
        //         }).catch((error) => {
        //             this.setState({ error: 1 })
        //         });
    }

    render() {
        return (
            <>
                <h1>Elenco assistiti</h1>
                &nbsp;&nbsp;
                <PatientInfo />
            </>
        );
    }
}

export default DashboardDoctors;
