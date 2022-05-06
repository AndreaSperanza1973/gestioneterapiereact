import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { patient } from '../helpers/api/api';
import { entitiesLabels, message } from '../helpers/Constants';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

function PatientProfile() {
    const [patientId, setPatientId] = useState(window.location.pathname.split('/').pop());
    const [patientProfile, setPatientProfile] = useState([]);
    const [canTravel, setCanTravel] = useState();
    const [canDrive, setCanDrive] = useState();
    const [isFumatore, setIsFumatore] = useState();
    const [isAlcool, setIsAlcool] = useState();

    useEffect(() => {
        const fetchPatient = async () => {
            await patient.get("Get/", patientId)
                .then((response) => {
                    if (response.status === 200) {
                        setPatientProfile(response.data.dati);
                        setCanTravel(response.data.dati.canTravel);
                        setCanDrive(response.data.dati.canDrive);
                        setIsFumatore(response.data.dati.isFumatore);
                        setIsAlcool(response.data.dati.isAlcool);
                    }
                }).catch((error) => {

                });
        };
        fetchPatient();
    }, []);

    function editPatient(evt) {
        evt.preventDefault();
        patient.post("UpdateProfile/", patientProfile)
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success(message.PATIENT + message.SuccessUpdate, entitiesLabels.SUCCESS, 3000);
                }
            }).catch((error) => {
                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
            });
    };

    const updateStatesCanTravel = () => {
        setPatientProfile({
            ...patientProfile, canTravel:
                !canTravel
        });
        setCanTravel(!canTravel);
    }

    const updateStatesCanDrive = () => {
        setPatientProfile({
            ...patientProfile, canDrive:
                !canDrive
        });
        setCanDrive(!canDrive);
    }

    const updateStatesIsFumatore = () => {
        setPatientProfile({
            ...patientProfile, isFumatore:
                !isFumatore
        });
        setIsFumatore(!isFumatore);
    }

    const updateStatesIsAlcool = () => {
        setPatientProfile({
            ...patientProfile, isAlcool:
                !isAlcool
        });
        setIsAlcool(!isAlcool);
    }

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const inputName = e.target.getAttribute('name');
        setPatientProfile({
            ...patientProfile, [inputName]:
                inputValue
        });
    };

    return (
        <>
            <div>
                <h1 className="h1">Profilo assistito</h1>
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12">
                        <form onSubmit={editPatient}>
                            <div className="form-grop mb-5">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input dark" type="checkbox" id="inlineCheckbox1" name="canTravel" checked={patientProfile.canTravel} onChange={() => updateStatesCanTravel()} />
                                    <label className="form-check-label small" htmlFor="inlineCheckbox1">Può viaggiare</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input dark" type="checkbox" id="inlineCheckbox2" name="canDrive" checked={patientProfile.canDrive} onChange={() => updateStatesCanDrive()} />
                                    <label className="form-check-label small" htmlFor="inlineCheckbox2">Può guidare</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input dark" type="checkbox" id="inlineCheckbox3" name="isFumatore" checked={patientProfile.isFumatore} onChange={() => updateStatesIsFumatore()} />
                                    <label className="form-check-label small" htmlFor="inlineCheckbox3">Fumatore</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input dark" type="checkbox" id="inlineCheckbox4" name="isAlcool" checked={patientProfile.isAlcool} onChange={() => updateStatesIsAlcool()} />
                                    <label className="form-check-label small" htmlFor="inlineCheckbox4">Assume alcool</label>
                                </div>
                            </div>
                            <div className="box">
                                <div className="label label-primary">NOTE</div>
                                <textarea id="note" className="form-control form-control-sm mb-3" rows={14} aria-describedby name="healthInfo" defaultValue={patientProfile.healthInfo} onChange={handleChange} />
                            </div>
                            <div className="container-fluid">
                                <div className="row justify-content-center">
                                    <div className="col-auto mb-3">
                                        <button className="btn btn-secondary me-3" id>Indietro</button><button className="btn btn-secondary me-3" id>Annulla</button>
                                    </div>
                                    <div className="col-auto ms-md-auto mb-3">
                                        <button className="btn btn-primary me-3" id type="submit" >Salva modifiche</button><button className="btn btn-primary" id>Avanti</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            < NotificationContainer />
            {/* <h1>Profilo paziente</h1>
            &nbsp;&nbsp;
            <Form>
                <div className='col-8'>
                    {['checkbox'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                            <Form.Check
                                checked={patientProfile.canTravel}
                                inline
                                label="Può viaggiare?"
                                name="canTravel"
                                type={type}
                                id={`inline-${type}-1`}
                                onChange={() => updateStatesCanTravel()}
                            />
                            <Form.Check
                                checked={patientProfile.canDrive}
                                inline
                                label="Può guidare?"
                                name="canDrive"
                                type={type}
                                id={`inline-${type}-2`}
                                onChange={() => updateStatesCanDrive()}
                            />
                            <Form.Check
                                checked={patientProfile.isFumatore}
                                inline
                                label="È fumatore?"
                                name="isFumatore"
                                type={type}
                                id={`inline-${type}-3`}
                                onChange={() => updateStatesIsFumatore()}
                            />
                            <Form.Check
                                checked={patientProfile.isAlcool}
                                inline
                                label="Assume alcool?"
                                name="isAlcool"
                                type={type}
                                id={`inline-${type}-4`}
                                onChange={() => updateStatesIsAlcool()}
                            />
                        </div>
                    ))}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Note</Form.Label>
                        <Form.Control as="textarea" name="healthInfo" rows={10} defaultValue={patientProfile.healthInfo} onChange={handleChange} />
                    </Form.Group>
                </div>
                <div className='mb-3'>
                    <Button onClick={() => editPatient()} >Salva le modifiche</Button>
                </div>
            </Form> */}

        </>

    )
}


export { PatientProfile }
