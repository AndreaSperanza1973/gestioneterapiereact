import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { api, user } from '../helpers/api/api';
import '../css/style.css';
import { Link } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';
import { entitiesLabels, message } from '../helpers/Constants';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import moment from 'moment';
export class Login extends Component {
    //STATO
    userModelProp = () => ({
        
    });
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            idDispositivo:'',
            dataOraRichiesta:moment(new Date()).format("DD/MM/YYYY HH:mm"),
        }
        this.validator = new SimpleReactValidator();
    }

    //FUNZIONI 

    handleChange = (el) => {
        const inputName = el.target.name;
        const inputValue = el.target.value;
        this.updateState(inputName, inputValue);
    };

    updateState = (inputName, inputValue) => {
        const statusCopy = { ...this.state };
        statusCopy[inputName] = inputValue;
        this.setState(statusCopy);
    };

    postLogin = () => {
        if (this.validator.allValid()) {
            user.post("Login", this.state)
                .then(async (response) => {
                    if (response.status == 200) {
                        sessionStorage.setItem('token', 'ok');
                        window.location.href = "/Dashboard";
                    }
                }).catch((error) => {
                    NotificationManager.error(message.ErrorLogin, entitiesLabels.ERROR, 3000);
                });
        } else {
            this.validator.showMessages();
            NotificationManager.warning(message.ErrorRequire, entitiesLabels.WARNING, 3000);
            this.forceUpdate();
        }
    };

    //VIEW 
    render() {

        const validations = {
            username: this.validator.message(
                'Email',
                this.state.username,
                'required|email'
            ),
            password: this.validator.message(
                'Password',
                this.state.password,
                'required'
            ),
        };
        return (
            <Container className=" text-center">
                <h1 className="text-color-title mt-2 p-2"> Login</h1>
                <Row className="mt-4">
                    <Col lg={4} md={5} sm={12} className="form box-color p-5 m-auto" >
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="text-light">Username</Form.Label>
                                <Form.Control isInvalid={validations.username != null} onChange={this.handleChange} type="username" name="username" placeholder="Username" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label className="text-light">Password</Form.Label>
                                <Form.Control isInvalid={validations.password != null} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                            </Form.Group>

                        </Form>
                        <Row>
                        <Col  className="form box-color p-5 m-auto col-6" >
                        <Button className=' ' variant="light " onClick={() => this.postLogin()} >
                                Login
                            </Button>
                        </Col>
                        <Col  className="form box-color p-5 m-auto col-6" >
                        <Link className='btn  btn-light position-button' variant="light " to="/Register">Signin</Link>
                        </Col> 
                            
                        </Row>
                    </Col>

                    <h6 className="mt-4 p-3 text-center text-secondary">Copyright <i className="fa fa-copyright"></i> </h6>
                </Row>

                < NotificationContainer />
            </Container>
        )
    }
}

export default Login
