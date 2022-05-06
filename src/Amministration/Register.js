import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, } from 'react-bootstrap';
import { api, medico, user } from '../helpers/api/api';
import { Link } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';
import { entitiesLabels, message } from '../helpers/Constants';
import 'react-notifications/lib/notifications.css';
import { Eye } from 'react-bootstrap-icons';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { findAllByTestId } from '@testing-library/react';
export class Register extends Component {
    userModelProp = () => ({
        id: 0,
        username: '',
        password: '',
        idRole: 1,

    });
    medicoModelProp = () => ({
        name: '',
        surName: '',
        fiscalCode: '',
        email: '',
        idCentroMedico: 0,
        phoneNumber: ''

    });
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            notification: '',
            notificationHeaderMessage: '',
            notificationMessage: '',
            show: undefined,
            confirmpassword: '',
            listCentriMedici: [],

            //TODO DA ELIMINARE 
            mendicalCenter: 1,
            userDto: {
                ...this.userModelProp(),
            },
            medicoDTO: {
                ...this.medicoModelProp()
            }
            
        }
        this.getListMedicalCenter = this.getListMedicalCenter.bind(this);
    }
    componentDidMount() {
        this.getListMedicalCenter();
    }
    getListMedicalCenter = () => {
        medico.getAll("GetCentriMedici")
            .then(async (response) => {
                if (response.status == 200) {
                    this.setState({ listCentriMedici: response.data.dati });
                }
            }).catch((error) => {

            })
            .finally(() => {
            });

    }
    InsertUser = () => {
        if (this.validator.allValid()) {
            let userDto = this.state.userDto;
            user.post("Save", this.state.userDto)
                .then((response) => {
                    if (response.status === 200) {
                        let medicoDto = this.state.medicoDTO;
                        medicoDto.email = response.data.dati.username;
                        medicoDto.idUser = response.data.dati.id;
                        medico.post("Register", this.state.medicoDTO)
                            .then((response) => {
                                if (response.status === 200) {
                                    NotificationManager.success(message.MEDICO + message.SuccessInsert, entitiesLabels.SUCCESS, 3000);
                                }
                            }).catch((error) => {
                                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
                            });
                    }
                }).catch((error) => {
                    NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
                });



        } else {
            this.validator.showMessages();
            NotificationManager.warning(message.ErrorRequire, entitiesLabels.WARNING, 3000);
            this.forceUpdate();
        }
    }
    onChange = (inputName) => {
        const selected = inputName.target;
        const id = selected.children[selected.selectedIndex].id;
        const statusCopy = { ...this.state };
        statusCopy['medicoDTO']['idCentroMedico'] =parseInt(id) ;
        this.setState(statusCopy);
      };
    handleChangeconfirm = (el) => {
        const inputName = el.target.name;
        const inputValue = el.target.value;
        this.updateStateconfirm(inputName, inputValue);
    };
    updateStateconfirm = (inputName, inputValue) => {
        const statusCopy = { ...this.state };
        statusCopy[inputName] = inputValue;

        this.setState(statusCopy);
    };
    handleChange = (el) => {
        let objName = el.target.alt;
        const inputName = el.target.name;
        const inputValue = el.target.value;
        this.updateState(inputName, inputValue, objName);
    };

    updateState = (inputName, inputValue, objName) => {
        const statusCopy = { ...this.state };
        statusCopy[objName][inputName] = inputValue;

        this.setState(statusCopy);
    };

    showPassword = () => {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    showConfirmPassword = () => {
        var x = document.getElementById("confirmpassword");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }
    render() {

        if (this.state.userDto.password === this.state.confirmpassword) {
            var equalPass = true
        } else {
            var equalPass = false;
        }

        const validations = {
            username: this.validator.message(
                'Email',
                this.state.userDto.username,
                'required|email'
            ),
            phoneNumber: this.validator.message(
                'Email',
                this.state.medicoDTO.phoneNumber,
                'required'
            ),
            password: this.validator.message(
                'Password',
                this.state.userDto.password,
                'required'
            ),
            confirmpassword: this.validator.message(
                'Confirm Password',
                this.state.confirmpassword,
                'required'
            ),
            equalPass: this.validator.message('equalPass', equalPass, 'accepted'),
        };
        return (
            <Container className=" text-center">
                <h1 className="text-color-title mt-2 p-2"> Register</h1>
                <Container className=" form box-color text-center ms-container">

                    <Form className="centering-form">
                        <Row>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" >
                                <Form.Label className="text-light">Cognome</Form.Label>
                                <Form.Control onChange={this.handleChange} name="name" alt="medicoDTO" placeholder="Enter cognome" />
                            </Form.Group>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" >
                                <Form.Label className="text-light">Nome</Form.Label>
                                <Form.Control onChange={this.handleChange} name="surName" alt="medicoDTO" placeholder="Enter Nome" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" >
                                <Form.Label className="text-light">Codice Fiscale</Form.Label>
                                <Form.Control onChange={this.handleChange} name="fiscalCode" alt="medicoDTO" placeholder="Enter Codice fiscale" />
                            </Form.Group>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" >
                                <Form.Label className="text-light">Centro Medico</Form.Label>
                                <Form.Select onChange={this.onChange} name="mendicalCenter"  alt="medicoDTO" placeholder="Enter centro medico" >
                                <option id="0">Seleziona Centro </option>
                               {this.state.listCentriMedici.map((item)=> 
                                <option id={item.id}>{item.nomeCentro}</option>
                               )}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" >
                                <Form.Label className="text-light">Email</Form.Label>
                                <Form.Control onChange={this.handleChange} id='eMail' alt="userDto" name="username" isInvalid={validations.username != null} placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" >
                                <Form.Label className="text-light">Telefono</Form.Label>
                                <Form.Control onChange={this.handleChange} id='phoneNumber' alt="medicoDTO" name="phoneNumber" isInvalid={validations.phoneNumber != null} placeholder="Enter email" />
                            </Form.Group>
                        </Row>
                        <Row className='pb-5'>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" controlId="formBasicPassword">
                                <Form.Label className="text-light">Password</Form.Label><Eye size='22' onClick={() => this.showPassword()} className='icon-white' />
                                <Form.Control type='password' id='password' alt="userDto" onChange={this.handleChange} name="password" isInvalid={validations.password != null} placeholder="Password" />
                            </Form.Group>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" controlId="formBasicPassword">
                                <Form.Label className="text-light">Confirm Password</Form.Label><Eye size='22' onClick={() => this.showConfirmPassword()} className='icon-white' />
                                <Form.Control type='password' id='confirmpassword' alt="confirmpassword" onChange={this.handleChangeconfirm} name="confirmpassword" isInvalid={validations.confirmpassword != null ||validations.equalPass != null } placeholder="Password" />
                            </Form.Group>
                            {validations.equalPass ? (
                                <div   className=" input-layout-wrapper text-danger">
                                    {' '}
                                    Le password devono coincidere{' '}
                                </div>
                            ) : <div   className=" input-layout-wrapper text-danger is-12">
                            {' '}{' '}
                        </div>}
                        </Row>
                        <Row >
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" controlId="formBasicPassword">
                                <Link className='btn  btn-light position-button' variant="light btn-block" to="/">Indietro</Link>
                            </Form.Group>
                            <Form.Group className="col-4 mb-3 input-layout-wrapper" controlId="formBasicPassword">
                                <Button variant="light" onClick={() => this.InsertUser()}>
                                    Registrati
                                </Button>
                            </Form.Group>
                        </Row>
                    </Form>
                </Container>
                < NotificationContainer />
            </Container>
        )
    }
}

export default Register
