import { Col, Table, Form, Button, Container, Row, Modal } from 'react-bootstrap';
import { iconDelete, iconEdit } from './icons';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import moment from 'moment';
import { patient } from '../helpers/api/api';
import { entitiesLabels, message } from '../helpers/Constants';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Pagination from '../helpers/pagination';

function AdverseEventsInfo() {
    const [patientId, setPatientId] = useState(window.location.pathname.split('/').pop());
    const [adverseEvents, setAdverseEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [adverseEventsPerPage] = useState(7);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchAdverseEvents = async () => {
            setLoading(true);
            await patient.get("Events/", patientId)
                .then((response) => {
                    if (response.status === 200) {
                        setAdverseEvents(response.data.dati);
                        setLoading(false);
                    }
                }).catch((error) => {

                });
        };
        fetchAdverseEvents();
    }, [show]);

    // Get current
    const indexOfLastAdverseEvent = currentPage * adverseEventsPerPage;
    const indexOfFirstAdverseEvent = indexOfLastAdverseEvent - adverseEventsPerPage;
    const currentAdverseEvents = adverseEvents?.slice(indexOfFirstAdverseEvent, indexOfLastAdverseEvent);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <>

            <h1>Eventi avversi</h1>

            &nbsp;&nbsp;
            <Col>
                <AdverseEventsTable adverseEvents={currentAdverseEvents} handleShow={handleShow} loading={loading} setAdverseEvents={setAdverseEvents}/>
                <Pagination
                    patientsPerPage={adverseEventsPerPage}
                    totalPatients={adverseEvents?.length}
                    paginate={paginate}
                />
            </Col>
            <div className='mb-3'>
                <Button variant="primary" id="btnAdd" onClick={handleShow}>Aggiungi eventi avversi <i class="fas fa-plus"></i></Button>
            </div>
            <AdverseEventsModal show={show} handleClose={handleClose} setAdverseEvents={setAdverseEvents}/>
        </>
    );
}

function AdverseEventsTable(props) {
    const deleteAdverseEvent = (code) => {
        props.setAdverseEvents((adverseEvents) => adverseEvents.filter(ex => ex.id !== code));
      };

    if (props.loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <>

            <div className='col-10'>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Intensità</th>
                            <th>Descrizione</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.adverseEvents?.map((ev) => <AdverseEventRow key={ev.id} adverseEvent={ev} deleteAdverseEvent={deleteAdverseEvent}/>)
                        }
                    </tbody>
                </Table>
            </div>



        </>
    );
}

function AdverseEventRow(props) {
    return <tr><AdverseEventRowData adverseEvent={props.adverseEvent} /> <RowControl adverseEventId={props.adverseEvent.id} deleteAdverseEvent={props.deleteAdverseEvent}/></tr>
}

function AdverseEventRowData(props) {
    return (<>
        <td>{props.adverseEvent.dateEvent.split(' ')[0]}</td>
        <td>{props.adverseEvent.idIntensity}</td>
        <td>{props.adverseEvent.description}</td>
        {/* {[''].map((type) => (
            <div key={`inline-${type}`} className="mb-3">
                <Form.Check
                    defaultChecked={props.adverseEvent.idIntensity}
                    inline
                    label="Lieve"
                    name="idIntensity"
                    type={type}
                    id={`inline-${type}-1`}
                    value="1"
                    disabled
                />
                <Form.Check
                    defaultChecked={props.adverseEvent.idIntensity}
                    inline
                    label="Moderata"
                    name="idIntensity"
                    type={type}
                    id={`inline-${type}-2`}
                    value="2"
                    disabled
                />
                <Form.Check
                    defaultChecked={props.adverseEvent.idIntensity}
                    inline
                    label="Severa"
                    name="idIntensity"
                    type={type}
                    id={`inline-${type}-3`}
                    value="3"
                    disabled
                />
            </div>
        ))} */}
    </>
    );
}

function RowControl(props) {
    return <td> <span onClick={() => props.deleteAdverseEvent(props.adverseEventId)}>{iconDelete}</span></td>;
  }
  

function AdverseEventsModal(props) {
    const [newAdverseEvent, setNewAdverseEvent] = useState({
        idPatientProfile: window.location.pathname.split('/').pop(),
        id: 0,
        description: "",
        dateEvent: "",
        idIntensity: 0,
    });

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const inputName = e.target.getAttribute('name');
        setNewAdverseEvent({
            ...newAdverseEvent, [inputName]:
                inputValue
        });
    };

    const clearState = () => {
        setNewAdverseEvent({
            idPatientProfile: window.location.pathname.split('/').pop(),
            id: 0,
            description: "",
            dateEvent: "",
            idIntensity: 0,
        })
    }

    function saveAdverseEvent() {
        newAdverseEvent.idPatientProfile = parseInt(newAdverseEvent.idPatientProfile);
        newAdverseEvent.idIntensity = parseInt(newAdverseEvent.idIntensity);
        moment(newAdverseEvent.dateEvent).format("DD/MM/YYYY")
        patient.post("Events/", newAdverseEvent)
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success(message.PATIENT + message.SuccessUpdate, entitiesLabels.SUCCESS, 3000);
                    props.setAdverseEvents(response.data.dati);
                }
            }).catch((error) => {
                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
            });
        clearState();
        props.handleClose();
    };


    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Aggiungi evento avverso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="adverseEventForm">
                        <Form.Group controlId="adverseEventDate">
                            <Form.Label>Data evento</Form.Label>
                            <Form.Control type="date" name="dateEvent" placeholder="Inizio" onChange={handleChange} />
                        </Form.Group>
                        <Form.Label>Intensità</Form.Label>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`} className="mb-3">
                                <Form.Check
                                    inline
                                    label="Lieve"
                                    name="idIntensity"
                                    type={type}
                                    id={`inline-${type}-1`}
                                    value="1"
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    inline
                                    label="Moderata"
                                    name="idIntensity"
                                    type={type}
                                    id={`inline-${type}-2`}
                                    value="2"
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    inline
                                    label="Severa"
                                    name="idIntensity"
                                    type={type}
                                    id={`inline-${type}-3`}
                                    value="3"
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                        <Form.Group className="mb-3" controlId="adverseEventDescription">
                            <Form.Label>Descrizione</Form.Label>
                            <Form.Control as="textarea" name="description" onChange={handleChange} rows={5} />
                        </Form.Group>
                    </Form>
                    < NotificationContainer />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" id="btnSave" onClick={saveAdverseEvent}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { AdverseEventsInfo };