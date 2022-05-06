import { Col, Table, Form, Button, Modal, Row } from 'react-bootstrap';
import { iconDelete, iconEdit } from './icons';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { patient } from '../helpers/api/api';
import { entitiesLabels, message } from '../helpers/Constants';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Pagination from '../helpers/pagination';

function EpilepticSeizuresInfo() {
    const [patientId, setPatientId] = useState(window.location.pathname.split('/').pop());
    const [epilepticSeizures, setEpilepticSeizures] = useState([]);
    const [patientProfile, setPatientProfile] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [epilepticSeizuresPerPage] = useState(5);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchPatient = async () => {
            await patient.get("Get/", patientId)
                .then((response) => {
                    if (response.status === 200) {
                        console.log("ciao");
                        setPatientProfile(response.data.dati);
                    }
                }).catch((error) => {

                });
        };
        fetchPatient();
    }, []);

    useEffect(() => {
        const fetchEpilepticSeizures = async () => {
            setLoading(true);
            await patient.get("Seizures/", patientId)
                .then((response) => {
                    if (response.status === 200) {
                        setEpilepticSeizures(response.data.dati);
                        setLoading(false);
                    }
                }).catch((error) => {

                });
        };
        fetchEpilepticSeizures();
    }, [show]);

    // Get current
    const indexOfLastEpilepticSeizure = currentPage * epilepticSeizuresPerPage;
    const indexOfFirstEpilepticSeizure = indexOfLastEpilepticSeizure - epilepticSeizuresPerPage;
    const currentEpilepticSeizures = epilepticSeizures?.slice(indexOfFirstEpilepticSeizure, indexOfLastEpilepticSeizure);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleChange = (e) => {
        const inputValue = parseInt(e.target.value);
        const inputName = e.target.getAttribute('name');
        setPatientProfile({
            ...patientProfile, [inputName]:
                inputValue
        });
    };

    function editPatient() {
        patient.post("UpdateProfile/", patientProfile)
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success(message.PATIENT + message.SuccessUpdate, entitiesLabels.SUCCESS, 3000);
                }
            }).catch((error) => {
                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
            });
    };

    return (
        <>
            <h2>Crisi epilettiche</h2>
            &nbsp;&nbsp;
            <Col className='mb-3'>
                <EpilepticSeizuresForm numberStartingSeizures={patientProfile.numeroCrisiPartenza} onChange={handleChange} />
            </Col>
            <Col className='mb-3'>
                <Button onClick={() => editPatient()} >Salva modifica</Button>
            </Col>

            <Col className='mb-3'>
                <EpilepticSeizuresTable epilepticSeizures={currentEpilepticSeizures} setEpilepticSeizures={setEpilepticSeizures} />
                <Pagination
                    patientsPerPage={epilepticSeizuresPerPage}
                    totalPatients={epilepticSeizures?.length}
                    paginate={paginate}
                />
            </Col>
            <EpilepticSeizuresModal show={show} handleClose={handleClose} patientId={patientId} setEpilepticSeizures={setEpilepticSeizures}/>
            <Col className='mb-3'>
                <Button variant="primary" id="btnAdd" onClick={handleShow}>Aggiungi crisi epilettiche <i class="fas fa-plus"></i></Button>&nbsp;&nbsp;
            </Col>
            < NotificationContainer />
        </>
    );
}

function EpilepticSeizuresForm(props) {

    return (
        <Form>
            <div className='col-6'>
                <Form.Group controlId='numberStartingSeizures'>
                    <Form.Label>Numero crisi di partenza</Form.Label>
                    <Form.Control type='text' name="numeroCrisiPartenza" defaultValue={props.numberStartingSeizures} onChange={props.onChange} />
                </Form.Group>
            </div>
        </Form>


    );
}

function EpilepticSeizuresTable(props) {
    const deleteEpilepticSeizure = (code) => {
        props.setEpilepticSeizures((epilepticSeizures) => epilepticSeizures.filter(ex => ex.id !== code));
    };

    return (
        <>

            <div className='col-10'>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrizione</th>
                            <th>Comportamenti</th>
                            <th>Contesto</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.epilepticSeizures?.map((ev) => <EpilepticSeizureRow key={ev.id} epilepticSeizure={ev} deleteEpilepticSeizure={deleteEpilepticSeizure} />)
                        }
                    </tbody>
                </Table>
            </div>
        </>
    );
}

function EpilepticSeizureRow(props) {
    return <tr><EpilepticSeizureRowData epilepticSeizure={props.epilepticSeizure} /> <RowControl epilepticSeizureId={props.epilepticSeizure.id} deleteEpilepticSeizure={props.deleteEpilepticSeizure} /></tr>
}

function EpilepticSeizureRowData(props) {

    const comportamentoCheck = props.epilepticSeizure.elencoComportamenti.map(c => c.id);
    const contestoCheck = props.epilepticSeizure.elencoContestualita.map(c => c.id);
    console.log(comportamentoCheck);
    console.log(contestoCheck);

    return (<>
        <td>{props.epilepticSeizure.dateTimeEventOccured.split(' ')[0]}</td>
        <td>{props.epilepticSeizure.description}</td>
        <td><div className='col-8'>
            {['checkbox'].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                    <Form.Check
                        checked={comportamentoCheck.includes(1)}
                        value="1"
                        inline
                        label="Crisi convulsiva generalizzata"
                        name="crisiConvulsivaGeneralizzata"
                        type={type}
                        id={`inline-${type}-1`}
                        disabled
                    />
                    <Form.Check
                        checked={comportamentoCheck.includes(2)}
                        value="2"
                        inline
                        label="Assenza/crisi focale"
                        name="assenzaCrisiFocale"
                        type={type}
                        id={`inline-${type}-2`}
                        disabled
                    />
                    <Form.Check
                        checked={comportamentoCheck.includes(3)}
                        value="3"
                        inline
                        label="Perdita di coscienza"
                        name="perditaDiCoscienza"
                        type={type}
                        id={`inline-${type}-3`}
                        disabled
                    />
                    <Form.Check
                        checked={comportamentoCheck.includes(4)}
                        value="4"
                        inline
                        label="Caduta a terra"
                        name="cadutaATerra"
                        type={type}
                        id={`inline-${type}-4`}
                        disabled
                    />
                </div>
            ))}
        </div></td>
        <td><div className='col-8'>
            {['checkbox'].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                    <Form.Check
                        checked={contestoCheck.includes(1)}
                        value="1"
                        inline
                        label="Casa"
                        name="casa"
                        type={type}
                        id={`inline-${type}-1`}
                        disabled
                    />
                    <Form.Check
                        checked={contestoCheck.includes(2)}
                        value="2"
                        inline
                        label="Lavoro"
                        name="lavoro"
                        type={type}
                        id={`inline-${type}-2`}
                        disabled
                    />
                    <Form.Check
                        checked={contestoCheck.includes(3)}
                        value="3"
                        inline
                        label="Tempo libero"
                        name="tempoLibero"
                        type={type}
                        id={`inline-${type}-3`}
                        disabled
                    />
                    <Form.Check
                        checked={contestoCheck.includes(4)}
                        value="4"
                        inline
                        label="Veglia"
                        name="veglia"
                        type={type}
                        id={`inline-${type}-4`}
                        disabled
                    />
                    <Form.Check
                        checked={contestoCheck.includes(5)}
                        value="5"
                        inline
                        label="Sonno"
                        name="sonno"
                        type={type}
                        id={`inline-${type}-5`}
                        disabled
                    />
                </div>
            ))}
        </div></td>
    </>
    );
}

function RowControl(props) {
    return <td> <span onClick={() => props.deleteEpilepticSeizure(props.epilepticSeizureId)}>{iconDelete}</span></td>;
}

function EpilepticSeizuresModal(props) {
    const [newEpilepticSeizures, setNewEpilepticSeizures] = useState({
        id: 0,
        idPatientProfile: props.patientId,
        description: "",
        dateTimeEventOccured: "",
        elencoComportamenti: [
            
        ],
        elencoContestualita: [
            
        ],
    });

    const [crisiConvulsivaGeneralizzata, setCrisiConvulsivaGeneralizzata] = useState(false);
    const [assenzaCrisiFocale, setAssenzaCrisiFocale] = useState(false);
    const [perditaDiCoscienza, setPerditaDiCoscienza] = useState(false);
    const [cadutaATerra, setCadutaATerra] = useState(false);

    const updateStatesCrisiConvulsivaGeneralizzata = (e) => {
        if (!crisiConvulsivaGeneralizzata) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoComportamenti: [...newEpilepticSeizures.elencoComportamenti, { description: "Crisi Convulsiva Generalizzata", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoComportamenti = newEpilepticSeizures.elencoComportamenti.filter(x => {
                return x.id != Id;
            })
            // var index = newEpilepticSeizures.elencoComportamenti?.map(x => {
            //     return x.id;
            // }).indexOf(Id);
            // newEpilepticSeizures.elencoComportamenti.splice(index, 1)
        }
        setCrisiConvulsivaGeneralizzata(!crisiConvulsivaGeneralizzata);
    }

    const updateStatesAssenzaCrisiFocale = (e) => {
        if (!assenzaCrisiFocale) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoComportamenti: [...newEpilepticSeizures.elencoComportamenti, { description: "Assenza / Crisi Focale", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoComportamenti = newEpilepticSeizures.elencoComportamenti.filter(x => {
                return x.id != Id;
            })
        }
        setAssenzaCrisiFocale(!assenzaCrisiFocale);
    }

    const updateStatesPerditaDiCoscienza = (e) => {
        if (!perditaDiCoscienza) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoComportamenti: [...newEpilepticSeizures.elencoComportamenti, { description: "Perdita di Coscienza", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoComportamenti = newEpilepticSeizures.elencoComportamenti.filter(x => {
                return x.id != Id;
            })
        }
        setPerditaDiCoscienza(!perditaDiCoscienza);
    }

    const updateStatesCadutaATerra = (e) => {
        if (!cadutaATerra) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoComportamenti: [...newEpilepticSeizures.elencoComportamenti, { description: "Caduta a Terra", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoComportamenti = newEpilepticSeizures.elencoComportamenti.filter(x => {
                return x.id != Id;
            })
        }
        setCadutaATerra(!cadutaATerra);
    }

    const [casa, setCasa] = useState(false);
    const [lavoro, setLavoro] = useState(false);
    const [tempoLibero, setTempoLibero] = useState(false);
    const [veglia, setVeglia] = useState(false);
    const [sonno, setSonno] = useState(false);

    const updateStatesCasa = (e) => {
        if (!casa) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoContestualita: [...newEpilepticSeizures.elencoContestualita, { description: "Casa", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoContestualita = newEpilepticSeizures.elencoContestualita.filter(x => {
                return x.id != Id;
            })
        }
        setCasa(!casa);
    }

    const updateStatesLavoro = (e) => {
        if (!lavoro) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoContestualita: [...newEpilepticSeizures.elencoContestualita, { description: "Lavoro", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoContestualita = newEpilepticSeizures.elencoContestualita.filter(x => {
                return x.id != Id;
            })
        }
        setLavoro(!lavoro);
    }

    const updateStatesTempoLibero = (e) => {
        if (!tempoLibero) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoContestualita: [...newEpilepticSeizures.elencoContestualita, { description: "Tempo Libero", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoContestualita = newEpilepticSeizures.elencoContestualita.filter(x => {
                return x.id != Id;
            })
        }
        setTempoLibero(!tempoLibero);
    }

    const updateStatesVeglia = (e) => {
        if (!veglia) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoContestualita: [...newEpilepticSeizures.elencoContestualita, { description: "Veglia", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoContestualita = newEpilepticSeizures.elencoContestualita.filter(x => {
                return x.id != Id;
            })
        }
        setVeglia(!veglia);
    }

    const updateStatesSonno = (e) => {
        if (!sonno) {
            setNewEpilepticSeizures({
                ...newEpilepticSeizures,
                elencoContestualita: [...newEpilepticSeizures.elencoContestualita, { description: "Sonno", id: parseInt(e.target.value) }],
            });
        } else {
            var Id = e.target.value;
            newEpilepticSeizures.elencoContestualita = newEpilepticSeizures.elencoContestualita.filter(x => {
                return x.id != Id;
            })
        }
        setSonno(!sonno);
    }

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const inputName = e.target.getAttribute('name');
        setNewEpilepticSeizures({
            ...newEpilepticSeizures, [inputName]:
                inputValue,
        });
    };

    function saveEpilepticSeizure() {
        newEpilepticSeizures.idPatientProfile = parseInt(props.patientId);
        
        patient.post("Seizures/", newEpilepticSeizures)
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success(message.PATIENT + message.SuccessUpdate, entitiesLabels.SUCCESS, 3000);
                    
                       
                        patient.get("Seizures/", props.patientId)
                            .then((response) => {
                                if (response.status === 200) {
                                    props.setEpilepticSeizures(response.data.dati);
                                    
                                }
                            }).catch((error) => {
            
                            });
                    
                    // props.setEpilepticSeizures(response.data.dati);
                }
            }).catch((error) => {
                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
            });
            clearState();
            props.handleClose();
            
    };

    const clearState = () => {
        setNewEpilepticSeizures({
            id: 0,
            idPatientProfile: props.patientId,
            description: "",
            dateTimeEventOccured: "",
            elencoComportamenti: [
       
            ],
            elencoContestualita: [
                
            ],
        })
        setCrisiConvulsivaGeneralizzata(false);
        setAssenzaCrisiFocale(false);
        setPerditaDiCoscienza(false);
        setCadutaATerra(false);
        setCasa(false);
        setLavoro(false);
        setTempoLibero(false);
        setVeglia(false);
        setSonno(false);
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Aggiungi crisi epilettica</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="epilepticSeizureForm">
                        <Form.Group controlId="epilepticSeizureDate">
                            <Form.Label>Data evento</Form.Label>
                            <Form.Control type="date" name="dateTimeEventOccured" placeholder="Data crisi" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="epilepticSeizureDescription">
                            <Form.Label>Descrizione</Form.Label>
                            <Form.Control as="textarea" name="description" placeholder="Descrizione" onChange={handleChange} rows={5} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="epilepticSeizureBehavior">
                            <Form.Label>Comportamenti</Form.Label>
                            <div className='col-8'>
                                {['checkbox'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check
                                            value="1"
                                            inline
                                            label="Crisi convulsiva generalizzata"
                                            name="crisiConvulsivaGeneralizzata"
                                            type={type}
                                            id={`inline-${type}-1`}
                                            onChange={updateStatesCrisiConvulsivaGeneralizzata
                                            }
                                        />
                                        <Form.Check
                                            value="2"
                                            inline
                                            label="Assenza/crisi focale"
                                            name="assenzaCrisiFocale"
                                            type={type}
                                            id={`inline-${type}-2`}
                                            onChange={updateStatesAssenzaCrisiFocale
                                            }
                                        />
                                        <Form.Check
                                            value="3"
                                            inline
                                            label="Perdita di coscienza"
                                            name="perditaDiCoscienza"
                                            type={type}
                                            id={`inline-${type}-3`}
                                            onChange={updateStatesPerditaDiCoscienza
                                            }
                                        />
                                        <Form.Check
                                            value="4"
                                            inline
                                            label="Caduta a terra"
                                            name="cadutaATerra"
                                            type={type}
                                            id={`inline-${type}-4`}
                                            onChange={updateStatesCadutaATerra
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="epilepticSeizureContext">
                            <Form.Label>Contesto</Form.Label>
                            <div className='col-8'>
                                {['checkbox'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check
                                            value="1"
                                            inline
                                            label="Casa"
                                            name="casa"
                                            type={type}
                                            id={`inline-${type}-1`}
                                            onChange={updateStatesCasa
                                            }
                                        />
                                        <Form.Check
                                            value="2"
                                            inline
                                            label="Lavoro"
                                            name="lavoro"
                                            type={type}
                                            id={`inline-${type}-2`}
                                            onChange={updateStatesLavoro
                                            }
                                        />
                                        <Form.Check
                                            value="3"
                                            inline
                                            label="Tempo libero"
                                            name="tempoLibero"
                                            type={type}
                                            id={`inline-${type}-3`}
                                            onChange={updateStatesTempoLibero
                                            }
                                        />
                                        <Form.Check
                                            value="4"
                                            inline
                                            label="Veglia"
                                            name="veglia"
                                            type={type}
                                            id={`inline-${type}-4`}
                                            onChange={updateStatesVeglia
                                            }
                                        />
                                        <Form.Check
                                            value="5"
                                            inline
                                            label="Sonno"
                                            name="sonno"
                                            type={type}
                                            id={`inline-${type}-5`}
                                            onChange={updateStatesSonno
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* <Form.Select aria-label="epilepticSeizureContext" name="contesto" onChange={(event) => {
                                setNewEpilepticSeizures(prevEpilepticSeizure => ({
                                    ...prevEpilepticSeizure,
                                    elencoContestualita: [{ ...prevEpilepticSeizure.elencoContestualita[0], contesto: parseInt(event.target.value) }]
                                }));
                            }} >
                                <option></option>
                                <option value="0">Casa</option>
                                <option value="1">Lavoro</option>
                                <option value="2">Tempo libero</option>
                                <option value="3">Veglia</option>
                                <option value="4">Sonno</option>
                            </Form.Select> */}
                        </Form.Group>

                    </Form>
                    < NotificationContainer />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Chiudi
                    </Button>
                    <Button variant="primary" id="btnSave" onClick={saveEpilepticSeizure}>
                        Salva crisi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { EpilepticSeizuresInfo };