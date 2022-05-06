import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { api, user } from '../helpers/api/api';
import { Link } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';
import { entitiesLabels, message, role } from '../helpers/Constants';
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
            idDispositivo: '',
            dataOraRichiesta: moment(new Date()).format("DD/MM/YYYY HH:mm"),
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
                        if(response.data.dati.userDTO.idRole === role.DOCTOR || response.data.dati.userDTO.idRole === role.CAREMANAGER){
                            localStorage.setItem('accessToken', response.data.dati.accessToken);
                            localStorage.setItem('refreshToken', response.data.dati.refreshToken);
                            localStorage.setItem('role', JSON.stringify(response.data.dati.userDTO));
                            window.location.href = "/Dashboard";
                        } else {
                            NotificationManager.error(message.ErrorUnauthorized, entitiesLabels.ERROR, 3000);
                        }
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
            /* <Container className=" text-center">
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
             </Container>*/
            <html lang="en" >

                <body className="splash custom-login">
                    <div className="wrapper">
                        <form action="" class="container">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-6 mb-3">
                                    <Form.Control isInvalid={validations.username != null} onChange={this.handleChange} type="username" name="username" placeholder="E-mail" />
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-6 mb-3 mb-md-3">
                                    <Form.Control isInvalid={validations.password != null} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-6 mb-2">
                                    <p className="text-center">
                                        <a href="" className="link-recovery small">Hai dimenticato la password?</a>
                                    </p>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div className="col-12 col-md-6 mb-3 d-flex justify-content-center justify-content-md-end">
                                <Button className='btn btn-primary btn-arrow'  onClick={() => this.postLogin()} >
                                 Login
                             </Button>
                                </div>
                                <div className="col-12 col-md-6 mb-3 d-flex justify-content justify-content-md">
                                <Link className='btn btn-primary btn-arrow'  to="/Register">Signin</Link>
                                </div>
                            </div>
                        </form>
                    </div>



                    <div className="modal fade" id="welcome" tabindex="-1" aria-labelledby="welcome" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni facere, facilis, ullam vero voluptatem labore.</p>
                                </div>
                                <div className="modal-footer"></div>
                            </div>
                        </div>
                    </div>

                    <script src="./script/jquery.slim.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
                    <script src="./script/swiper.bundle.min.js"></script>
                    < NotificationContainer />

                </body>
            </html>
        )
    }
}

export default Login
