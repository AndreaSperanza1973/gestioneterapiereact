import React, { Component, useState, useEffect } from 'react';
import { Tabs, Tab, Container, Form, Row, InputGroup, Button, FormControl, Table, Modal } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { RowCustom } from "./PatientComponent"
import { medico, pianoterapeutico, patient, medication } from '../helpers/api/api';
import DatePicker from "react-datepicker";
import { entitiesLabels, message } from '../helpers/Constants';
import { PatientRow, PatientAllergyRow } from "./PatientComponent";
import moment from 'moment';
import Pagination from '../helpers/pagination';

export class NewTherapy extends Component {
    allergiesProps = () => ({
        id: 0,
        nomeFarmaco: "",
        idPatientProfile: parseInt(window.location.pathname.split('/').pop())
    })
    farmaciProps = () => ({
        id: 0,
        quantitaPrescrizione: 0,
        oraAssunzioneIndicata: 0,
        dataFine: null,
        dataInizio: null,
        isActiveReminder: false,
        idPianoTerapeutico: 1,
        formulazione: {
            id: 0,
            formula: 0,
            idFarmaco: 0,
            isStandard: false,
            farmaco: {
                id: 0,
                nome: '',
                isOntozry: false
            }
        }
    })
    constructor(props) {
        super(props);
        this.state = {

            listOntozry: [],
            listOtherPharmacy: [],
            isOntozryFlag: false,
            items: [],
            dateNow: '',
            isNewPatient:localStorage.getItem('newPatient') ,
            patients: [],
            pharmacyPatients: [],
            currentPage: 1,
            storicPlan: [],
            patientsPerPage: 5,
            allergiesDTO: { ...this.allergiesProps() },
            isOpenAllergic: false,
            isOpenModalOntozry: false,
            isOtherOntozry: false,
            therapyDto: {

                therapeuticPlan: {
                    id: 0,

                    versione: 0,
                    maxReminderNotification: 0,
                    dataPrescrizione: moment(new Date()).format("DD/MM/YYYY"),
                    inizioTerapia: null,
                    dataFineTerapia: null,
                    motivoFineTerapia: "",
                    idDoctor: JSON.parse(localStorage.getItem("role")).id,
                    idPatientProfile: parseInt(window.location.pathname.split('/').pop()),
                    elencoFarmaciPrescritti: [],
                },
                ontozryMedication: [],
                otherMedication: [],
                medicationAllergies: [],
                storicPlan: [],
            },
            medicationDTO: {
                ...this.farmaciProps()
            },
        };
    }

    componentDidMount() {
        localStorage.removeItem('newPatient');
        medication.getAll("GetAll/")
            .then((response) => {
                if (response.status === 200) {
                    var listOntozryInfo = response.data.dati.filter((x) => x.isOntozry == true);
                    var listOtherPharmacyInfo = response.data.dati.filter((x) => x.isOntozry != true);
                    this.setState({
                        listOntozry: listOntozryInfo[0].elencoFormulazioni,
                        listOtherPharmacy: listOtherPharmacyInfo
                    });
                }
            }).catch((error) => {
                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
            });
        patient.get("GetAllergies/", window.location.pathname.split('/').pop())
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        pharmacyPatients: response.data.dati,
                    });
                }
            }).catch((error) => {
                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
            });
        pianoterapeutico.get("Get/", parseInt(window.location.pathname.split('/').pop()))
            .then((response) => {
                if (response.status === 200 && response.data.dati != null) {

                    this.setState({
                        therapyDto: response.data.dati,
                    });
                }
            }).catch((error) => {
                this.setState({ error: 1 })
            });
        pianoterapeutico.get("Storico/", parseInt(window.location.pathname.split('/').pop()))
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        storicPlan: response.data.dati,
                    });
                }
            }).catch((error) => {
                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
            });
    }
    //FUNZIONI POST
    updateTherapy = () => {
        this.state.therapyDto.ontozryMedication.map((el) =>
            el.id != 0 ? el.id = 0 : ''
        )
        this.state.therapyDto.otherMedication.map((el) =>
            el.id != 0 ? el.id = 0 : ''
        )

        this.state.therapyDto.therapeuticPlan.id = 0;
        pianoterapeutico.post("SaveCompleteTherapy", this.state.therapyDto)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.dati.statoesito != 1) {
                        NotificationManager.success(message.TERAPIA + message.SuccessInsert, entitiesLabels.SUCCESS, 3000);
                        this.setState({
                            therapyDto: response.data.dati,
                        });
                    } else {
                        NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
                    }
                }
            }).catch((error) => {
                NotificationManager.error(message.ErrorServer, entitiesLabels.ERROR, 3000);
            });
    }
    AddAllergies = () => {
        if (this.state.therapyDto.idPatientProfile != 0) {
            let updateDTO = this.state.allergiesDTO;
            updateDTO.idPatientProfile = this.state.therapyDto.therapeuticPlan.idPatientProfile;
        }
        var list = [];
        var allergia = this.state.allergiesDTO;
        list = this.state.therapyDto.medicationAllergies;
        var id = this.state.therapyDto.medicationAllergies.length;
        allergia.id = id + 1;
        list.push(allergia);
        this.setState({ isOpenAllergic: false, allergiesDTO: { ...this.allergiesProps() } });
    }
    deleteItem(el) {
        var listFilter = this.state.therapyDto.medicationAllergies.filter(x => x.id != el)
        this.updateState('medicationAllergies', listFilter, 'therapyDto');
    }
    setCurrentPage = (n) => {
        this.setState({ currentPage: n });
    }

    handleCloseOtherPharmacy = () => {
        this.setState({ isOpenOtherPharmacy: false });
    }
    handleShowOtherPharmacy = () => {
        this.setState({ isOpenModalOntozry: true, isOntozryFlag: false });
    }

    handleCloseAllergic = () => {
        this.setState({ isOpenAllergic: false });
    }
    handleShowAllergic = () => {
        this.setState({ isOpenAllergic: true });
    }
    initialState = () => {
        var value = moment(new Date()).format("DD/MM/YYYY");
        this.setState({ dateNow: value });

    }
    handleChange = (value, formattedValue) => {
        this.setState({
            dateNow: moment(value).format("DD/MM/YYYY"),
            formattedValue: formattedValue
        });
        var plan = this.state.therapyDto.therapeuticPlan;
        plan.dataFineTerapia = moment(value).format("DD/MM/YYYY");
        this.updateState('therapeuticPlan', plan, 'therapyDto');
    }
    handleChangeStartDateMedication = (value, formattedValue) => {
        this.setState({
            dateNow: moment(value).format("DD/MM/YYYY"),
            formattedValue: formattedValue
        });
        this.updateState('dataInizio', moment(value).format("DD/MM/YYYY"), 'medicationDTO');
    }
    handleChangeEndDateMedication = (value, formattedValue) => {
        this.setState({
            dateNow: moment(value).format("DD/MM/YYYY"),
            formattedValue: formattedValue
        });
        this.updateState('dataFine', moment(value).format("DD/MM/YYYY"), 'medicationDTO');
    }
    handleChangeNote = (el) => {
        var plan = this.state.therapyDto.therapeuticPlan;
        plan.motivoFineTerapia = el.target.value;
        this.updateState('therapeuticPlan', plan, 'therapyDto');
    };
    handleChangeFarmaco = (el) => {
        let objName = el.target.alt;
        const inputName = el.target.name;
        const inputValue = el.target.value;
        this.updateState(inputName, inputValue, 'allergiesDTO');
    };
    handleChangeTherapy = (el) => {
        let objName = el.target.alt;
        const inputName = el.target.name;
        const inputValue = el.target.value;
        this.updateState(inputName, inputValue, objName);
    };
    handleChangeIntTherapy = (el) => {
        let objName = el.target.alt;
        const inputName = el.target.name;
        const inputValue = el.target.value;
        this.updateState(inputName, parseInt(inputValue), objName);
    };
    updateState = (inputName, inputValue, objName) => {
        let statusCopy = Object.assign({}, this.state);
        statusCopy[objName][inputName] = inputValue;
        this.setState(statusCopy);
    };
    updateStateOnt = (inputName, inputValue, objName) => {
        let statusCopy = Object.assign({}, this.state);
        if (inputValue.farmaco.id == 0) {

            statusCopy.isOtherOntozry = true;
        }
        if (inputValue.farmaco.id == -1) {

            statusCopy.isOtherOntozry = false;
        }
        statusCopy[objName][inputName] = inputValue;
        this.setState(statusCopy);
    };
    openModalOntozry = () => {

        this.setState({ isOpenModalOntozry: true, isOntozryFlag: true });
    }
    handleClose = () => {
        this.setState({ isOpenModalOntozry: false, isOntozryFlag: false });
    }
    returnToMenu = () => {
        localStorage.removeItem('newPatient');
        window.location.href = "/Dashboard";
    }
    activeReminder = () => {
        const inputValue = this.state.medicationDTO.isActiveReminder ? false : true;
        this.updateState('isActiveReminder', inputValue, 'medicationDTO');
    }
    addOntozry = () => {
        var list = [];
        var farmaco = this.state.medicationDTO;

        var id = this.state.therapyDto.ontozryMedication.length;
        farmaco.id = id + 1;
        var list = this.state.therapyDto.ontozryMedication.push(farmaco);
        this.setState({ ontozryMedication: { list }, isOpenModalOntozry: false, medicationDTO: { ...this.farmaciProps() } });

    }
    addOther = () => {
        var list = [];
        var farmaco = this.state.medicationDTO;
        list = this.state.therapyDto.ontozryMedication;
        var id = this.state.therapyDto.otherMedication.length;
        farmaco.id = 0;
        list = this.state.therapyDto.otherMedication;
        list.push(farmaco);
        this.setState({ otherMedication: { list }, isOpenModalOntozry: false, medicationDTO: { ...this.farmaciProps() } });

    }
    handleChangeDosagio = (inputName) => {
        var formulaziones = this.state.medicationDTO.formulazione;
        formulaziones.formula = inputName.target.value;
        this.updateState('formulazione', formulaziones, 'medicationDTO');
    }
    handleChangeNameFarmaco = (inputName) => {
        var formulaziones = this.state.medicationDTO.formulazione;
        formulaziones.farmaco.nome = inputName.target.value;
        this.updateState('formulazione', formulaziones, 'medicationDTO');
    }
    onChangeDrop = (inputName) => {
        const selected = inputName.target;
        if (inputName.target.value == "Altra formulazione") {
            var isOtherOntozry = true;
        }
        if (inputName.target.value == "Seleziona") {
            var isOtherOntozry = false;
        }
        if (!isOtherOntozry) {
            if (inputName.target.value != "Seleziona") {
                let id = selected.children[selected.selectedIndex].id;
                var element = this.state.listOntozry.filter(x => x.id == id)
                var formulazione = {
                    id: 0,
                    formula: element[0].formula,
                    idFarmaco: 0,
                    isStandard: true,
                    farmaco: {
                        id: element[0].id,
                        nome: 'Ontozry',
                        isOntozry: true
                    }
                }
            } else {
                var formulazione = {
                    id: 0,
                    formula: '',
                    idFarmaco: 0,
                    isStandard: false,
                    farmaco: {
                        id: -1,
                        nome: 'Ontozry',
                        isOntozry: true
                    }
                }
            }
        } else {

            var formulazione = {
                id: 0,
                formula: '',
                idFarmaco: 0,
                farmaco: {
                    id: 0,
                    nome: 'Ontozry',
                    isOntozry: true
                }
            }

        }

        this.updateStateOnt('formulazione', formulazione, 'medicationDTO');
    };
    onChangeDropOther = (inputName) => {
        const selected = inputName.target;

        let id = selected.children[selected.selectedIndex].id;
        var element = this.state.listOtherPharmacy.filter(x => x.id == id)
        var formulazione = {
            id: 0,
            formula: element[0].formula,
            idFarmaco: 0,
            farmaco: {
                id: element[0].id,
                nome: element[0].nome,
                isOntozry: true
            }
        }
        this.updateStateOnt('formulazione', formulazione, 'medicationDTO');
    };
    deleteElementOnto = (el) => {
        var listFilter = this.state.therapyDto.ontozryMedication.filter(x => x.id != el)
        this.updateState('ontozryMedication', listFilter, 'therapyDto');
    }
    deleteElementOther = (el) => {
        var listFilter = this.state.therapyDto.otherMedication.filter(x => x.id != el)
        this.updateState('otherMedication', listFilter, 'therapyDto');
    }
    render() {
        const indexOfLastPatient = this.state.currentPage * this.state.patientsPerPage;
        const indexOfFirstPatient = indexOfLastPatient - this.state.patientsPerPage;
        const indexOfLastpharmacyPatient = this.state.currentPage * this.state.patientsPerPage;
        const indexOfFirstpharmacyPatient = indexOfLastPatient - this.state.patientsPerPage;
        const currentFarmaci = this.state.therapyDto.otherMedication.slice(indexOfFirstPatient, indexOfLastPatient);
        const pharmacyPatients = this.state.therapyDto.medicationAllergies.slice(indexOfFirstpharmacyPatient, indexOfLastpharmacyPatient);
        const currentItem = this.state.therapyDto.ontozryMedication.slice(indexOfFirstPatient, indexOfLastPatient);
        const currentstoric = this.state.storicPlan ? this.state.storicPlan.slice(indexOfFirstPatient, indexOfLastPatient) : [];
        currentFarmaci.map((pa) => { pa.delete = 'delete'; });
        currentItem.map((pa) => { pa.delete = 'delete'; });
        return (
            <Container className=''>
                <Row className='col-12 pt-4' >
                    <Tabs defaultActiveKey="ontozry" id="uncontrolled-tab-example" className=" col-12 mb-3">

                        <Tab eventKey="ontozry" title="Ontozry">
                            <Row>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary" onClick={() => this.openModalOntozry()}>
                                        Aggiungi
                                    </Button>
                                </Form.Group></Row>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Ontozry</th>
                                        <th>Quantita</th>
                                        <th>Data Inizio</th>
                                        <th>Data Fine</th>
                                        <th>Orario Assunzione</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currentItem.map((pa) => <RowCustom colums={["formulazione.formula", "quantitaPrescrizione", "dataInizio", "dataFine", "oraAssunzioneIndicata", "delete"]} elementDelete={"delete"} reference={'id'} delete={(el) => this.deleteElementOnto(el)} item={pa} />)
                                    }
                                </tbody>
                            </Table>
                            <Row>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary" >
                                        Indietro
                                    </Button>
                                </Form.Group>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary">
                                        Avanti
                                    </Button>
                                </Form.Group>
                            </Row>
                            <Modal
                                show={this.state.isOpenModalOntozry}
                                onHide={() => this.handleClose()}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>{this.state.isOntozryFlag ? 'Aggiungi Ontozry' : 'Aggiungi nuovi farmaci'}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row className="col-12 mb-3">
                                        {!this.state.isOntozryFlag ?
                                            <Form.Group className="col-6 mb-3 input-layout-wrapper" >
                                                <Form.Label className="text">Formualzione</Form.Label>
                                                <Form.Select onChange={(el) => this.onChangeDropOther(el)} name="mendicalCenter" alt="medicoDTO" placeholder="Enter centro medico" >
                                                    <option id="0">Seleziona </option>

                                                    {this.state.listOtherPharmacy.map((item) =>
                                                        <option id={item.id}>{item.nome}</option>
                                                    )}
                                                </Form.Select>
                                            </Form.Group>
                                            :
                                            <Form.Group className="col-6 mb-3 input-layout-wrapper" >
                                                <Form.Label className="text">Formualzione</Form.Label>
                                                <Form.Select onChange={(el) => this.onChangeDrop(el)} name="mendicalCenter" alt="medicoDTO" placeholder="Enter centro medico" >
                                                    <option id="0">Seleziona </option>

                                                    {!this.state.isOtherOntozry ? this.state.listOntozry.filter(x => x.isOntozry != false && x.isStandard == true).map((item) =>
                                                        <option id={item.id}>{item.formula}</option>
                                                    ) : []}
                                                    <option id="OTHER">Altra formulazione</option>
                                                </Form.Select>
                                            </Form.Group>}
                                        {!this.state.isOntozryFlag ? <React.Fragment >
                                            <Form.Group className="col-6 mb-3" >
                                                <Form.Label className="text-">Dosaggio</Form.Label>
                                                <Form.Control id="quantitaPrescrizione" onChange={this.handleChangeDosagio} alt="medicationDTO" name="quantitaPrescrizione" placeholder="Inserisci farmaco" />
                                            </Form.Group>
                                            <Form.Group className="col-6 mb-3" >
                                                <Form.Label className="text-">Quantita</Form.Label>
                                                <Form.Control id="quantitaPrescrizione" onChange={this.handleChangeIntTherapy} type='number' alt="medicationDTO" name="quantitaPrescrizione" placeholder="Inserisci farmaco" />
                                            </Form.Group>
                                        </React.Fragment>
                                            : <React.Fragment >
                                                {this.state.isOtherOntozry ?
                                                    <Form.Group className="col-6 mb-3" >
                                                        <Form.Label className="text-">Formula</Form.Label>
                                                        <Form.Control disabled={!this.state.isOtherOntozry ? true : false} id="formulazioneOnt" type='number' onChange={this.handleChangeDosagio} alt="medicationDTO" name="quantitaPrescrizione" placeholder="Inserisci farmaco" />
                                                    </Form.Group>
                                                    : ''}
                                            </React.Fragment>
                                        }
                                    </Row>
                                    {this.state.isOntozryFlag ? <React.Fragment >
                                        <Row className="col-14 mb-3">
                                            <Form.Group className="col-6 mb-3" >
                                                <Form.Label className="text-">Quantita</Form.Label>
                                                <Form.Control id="quantitaPrescrizione" onChange={this.handleChangeIntTherapy} type='number' alt="medicationDTO" name="quantitaPrescrizione" placeholder="Inserisci farmaco" />
                                            </Form.Group>
                                        </Row>
                                    </React.Fragment> : ''}

                                    <Row className="col-14 mb-3">
                                        <Form.Group className="col-6 mb-3" >
                                            <Form.Label className="text">Data inizio terapia</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Button variant="outline-secondary" className='bi bi-calendar-date-fill' id="button-addon1" />
                                                <div className='datepicker-wrapper-datemodal datepicker-wrapper-modal'>
                                                    <DatePicker id='startTherapy' name={'startTherapy'} aria-label="Example text with button addon"
                                                        aria-describedby="basic-addon1" className=' form-control bi bi-calendar-date-fill' value={this.state.medicationDTO.dataInizio} onChange={this.handleChangeStartDateMedication} />
                                                </div>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="col-6 mb-3" >
                                            <Form.Label className="text">Data fine terapia</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Button variant="outline-secondary" className='bi bi-calendar-date-fill' id="button-addon1" />
                                                <div className='datepicker-wrapper-datemodal datepicker-wrapper-modal'>
                                                    <DatePicker id='startTherapy' name={'startTherapy'} aria-label="Example text with button addon"
                                                        aria-describedby="basic-addon1" className=' form-control bi bi-calendar-date-fill' value={this.state.medicationDTO.dataFine} onChange={this.handleChangeEndDateMedication} />
                                                </div>
                                            </InputGroup>
                                        </Form.Group>
                                    </Row>
                                    <Row className="col-12 mb-3">

                                        <Form.Group className="col-6 mb-3" >
                                            <Form.Label className="text-">Orario  consigliato assunzione {this.state.isOntozryFlag ? 'Ontozry' : ''} </Form.Label>
                                            <Form.Control id="oraAssunzioneIndicata" onChange={this.handleChangeIntTherapy} alt="medicationDTO" name="oraAssunzioneIndicata" placeholder="Inserisci farmaco" />
                                        </Form.Group>
                                        <Form.Group className="col-2 mb-3" >
                                            <Form.Label className="text-">Promemoria Terapie</Form.Label>
                                            <Form.Check
                                                type="switch"
                                                defaultChecked={this.state.medicationDTO.isActiveReminder}
                                                id="custom-switch"
                                                onClick={() => this.activeReminder()}
                                                label={!this.state.medicationDTO.isActiveReminder ? 'No' : 'Si'}
                                            />
                                        </Form.Group>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.handleClose()}>
                                        Chiudi
                                    </Button>
                                    {this.state.isOntozryFlag ?
                                        <Button variant="primary" onClick={() => this.addOntozry()}>{'Aggiungi'}</Button> :
                                        <Button variant="primary" onClick={() => this.addOther()}>{'Aggiungi'}</Button>}

                                </Modal.Footer>
                            </Modal>
                        </Tab>
                        <Tab eventKey="altriFarmaci" title="Altri Farmaci" >
                            <Modal
                                show={this.state.isOpenOtherPharmacy}
                                onHide={() => this.handleCloseOtherPharmacy()}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Aggiungi nuovi farmaci </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Form.Group className="col-8 mb-3" >
                                            <Form.Label className="text-">Farmaco</Form.Label>
                                            <Form.Control name="farmaco" placeholder="Inserisci farmaco" onChange={this.handleChangeTherapy} />
                                        </Form.Group>
                                        <Form.Group className="col-2 mb-3" >
                                            <Form.Label className="text-">Promemoria Terapie</Form.Label>
                                            <Form.Check
                                                type="switch"
                                                defaultChecked={this.state.medicationDTO.isActiveReminder}
                                                id="custom-switch"
                                                onClick={() => this.activeReminder()}
                                                label={!this.state.medicationDTO.isActiveReminder ? 'No' : 'Si'}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="col-6 mb-3" >
                                            <Form.Label className="text-">Dosaggio</Form.Label>
                                            <Form.Control name="dosagio" placeholder="Inserisci Dosaggio" onChange={this.handleChangeTherapy} />
                                        </Form.Group>
                                        <Form.Group className="col-6 mb-3" >
                                            <Form.Label className="text-">Quantita</Form.Label>
                                            <Form.Control name="quantita" placeholder="Inserisci quantita" onChange={this.handleChangeTherapy} />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Row>
                                            <Form.Group className="col-6 mb-3" >
                                                <Form.Label className="text">Data inizio terapia</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Button variant="outline-secondary" className='bi bi-calendar-date-fill' id="button-addon1" />
                                                    <div className='datepicker-wrapper-datemodal datepicker-wrapper-modal'>
                                                        <DatePicker id='startTherapy' name={'startTherapy'} aria-label="Example text with button addon"
                                                            aria-describedby="basic-addon1" className=' form-control bi bi-calendar-date-fill' value={this.state.dateNow} onChange={this.handleChangeStartDateMedication} />
                                                    </div>
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group className="col-6 mb-3" >
                                                <Form.Label className="text">Data fine terapia</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Button variant="outline-secondary" className='bi bi-calendar-date-fill' id="button-addon1" />
                                                    <div className='datepicker-wrapper-datemodal datepicker-wrapper-modal'>
                                                        <DatePicker id='endTherapy' name={'endTherapy'} aria-label="Example text with button addon"
                                                            aria-describedby="basic-addon1" className=' form-control bi bi-calendar-date-fill' value={this.state.dateNow} onChange={this.handleChangeEndDateMedication} />
                                                    </div>
                                                </InputGroup>
                                            </Form.Group>
                                        </Row>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.handleCloseOtherPharmacy()}>
                                        Chiudi
                                    </Button>
                                    <Button variant="primary">Aggiungi</Button>
                                </Modal.Footer>
                            </Modal>
                            <Row>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary" onClick={() => this.handleShowOtherPharmacy()}>
                                        Aggiungi
                                    </Button>
                                </Form.Group></Row>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Farmaco</th>
                                        <th>Dosaggio</th>
                                        <th>Quantita</th>
                                        <th>Data Inizio</th>
                                        <th>Data Fine</th>
                                        <th>Orario Assunzione</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currentFarmaci.map((pa) => <RowCustom id={pa.id} colums={["formulazione.farmaco.nome", "formulazione.formula", "quantitaPrescrizione", "dataInizio", "dataFine", "oraAssunzioneIndicata", "delete"]} elementDelete={"delete"} reference={'id'} delete={(el) => this.deleteElementOther(el)} item={pa} />)
                                    }
                                </tbody>
                            </Table>
                            <Pagination
                                patientsPerPage={3}
                                totalPatients={this.state.patients.length}
                                paginate={(pageNumber) => this.setCurrentPage(pageNumber)}
                            />
                            <Row>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary">
                                        Indietro
                                    </Button>
                                </Form.Group>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary">
                                        Avanti
                                    </Button>
                                </Form.Group>
                            </Row>
                        </Tab>
                        <Tab eventKey="allergieFarmaci" title="Allergie a farmaci" >
                            <Modal
                                show={this.state.isOpenAllergic}
                                onHide={() => this.handleCloseAllergic()}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Aggiungi farmaco  a cui è allergico il paziente</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Form.Group className="col-12 mb-3" >
                                            <Form.Label className="text-">Farmaco avverso</Form.Label>
                                            <Form.Control id="nomeFarmaco" onChange={this.handleChangeFarmaco} alt="allergiesDTO" name="nomeFarmaco" placeholder="Inserisci farmaco" />
                                        </Form.Group>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.handleCloseAllergic()}>
                                        Chiudi
                                    </Button>
                                    <Button variant="primary" onClick={() => this.AddAllergies()}>Aggiungi</Button>
                                </Modal.Footer>
                            </Modal>
                            <Row>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary" onClick={() => this.handleShowAllergic()}>
                                        Aggiungi
                                    </Button>
                                </Form.Group></Row>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Farmaco a cui è allergico il paziente</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pharmacyPatients.map((pa) => <PatientAllergyRow key={pa.id} allergy={pa.nomeFarmaco} delete={(el) => this.deleteItem(el)} id={pa.id} />)
                                    }
                                </tbody>
                            </Table>
                            <Pagination
                                patientsPerPage={this.state.patientsPerPage}
                                totalPatients={this.state.pharmacyPatients?.length}
                                paginate={(pageNumber) => this.setCurrentPage(pageNumber)}
                            />
                            <Row>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary">
                                        Indietro
                                    </Button>
                                </Form.Group>
                                <Form.Group className="col-4 mb-3" >
                                    <Button variant="btn btn-primary bi-cloud-check" onClick={() => this.updateTherapy()} >
                                        Salva Terapia
                                    </Button>
                                </Form.Group>
                            </Row>
                        </Tab>
                        {this.state.isNewPatient  ? '':
                            
                                <Tab eventKey="terapia" title="Cessazione Terapia">

                                    <Form className="">
                                        <Row>
                                            <Form.Group className="col-6 mb-3" >
                                                <Form.Label className="text">Data inizio terapia</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Button disabled variant="outline-secondary" className='bi bi-calendar-date-fill' id="button-addon1" />
                                                    <div className='datepicker-wrapper-date datepicker-wrapper'>
                                                        <DatePicker disabled id='startTherapy' name={'startTherapy'} aria-label="Example text with button addon"
                                                            aria-describedby="basic-addon1" className=' form-control bi bi-calendar-date-fill' value={this.state.therapyDto.therapeuticPlan.inizioTerapia} onChange={this.handleChange} />
                                                    </div>
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group className="col-6 mb-3" >
                                                <Form.Label className="text">Data fine terapia</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Button variant="outline-secondary" className='bi bi-calendar-date-fill' id="button-addon1" />
                                                    <div className='datepicker-wrapper-date datepicker-wrapper'>
                                                        <DatePicker id='endTherapy' name={'endTherapy'} aria-label="Example text with button addon"
                                                            aria-describedby="basic-addon1" className=' form-control bi bi-calendar-date-fill' value={this.state.therapyDto.therapeuticPlan.dataFineTerapia} onChange={this.handleChange} />
                                                    </div>
                                                </InputGroup>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <div className='col-lg-8'>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text>Motivo fine terapia </InputGroup.Text>
                                                    <FormControl as="textarea" aria-label="With textarea" id="motivoFineTerapia" onChange={this.handleChangeNote} name="motivoFineTerapia" />
                                                </InputGroup>
                                            </div>
                                        </Row>
                                        <Row>
                                            <Form.Group className="col-4 mb-3" >
                                                <Button variant="btn btn-primary " onClick={() => this.returnToMenu()}>
                                                    Indietro
                                                </Button>
                                            </Form.Group>
                                            <Form.Group className="col-4 mb-3" >
                                                <Button variant="btn btn-primary  " >
                                                    Avanti
                                                </Button>
                                            </Form.Group>
                                        </Row>
                                    </Form>
                                </Tab>}
                                {this.state.isNewPatient  ? '':
                                <Tab eventKey="storicoTerapie" title="Storico Terapie" >
                                    <Row>
                                        {
                                            currentstoric.map((el) =>
                                                <Row className='pb-2 mb-5'>
                                                    <div className='col-4'>
                                                        <div className='col-12'>
                                                            <b>Dottore:</b>  {el.nameDoctor}
                                                        </div>
                                                        <div className='col-12 '>
                                                            <b>Initzio  terapia: </b>  {el.inizioTerapia}
                                                        </div>
                                                        <div className='col-12'>
                                                            <b>Fine Terapia:</b>  {el.dataFineTerapia}
                                                        </div>
                                                    </div>
                                                    <div className='col-8'>
                                                        <Table striped bordered hover size="sm">
                                                            <thead>
                                                                <tr>
                                                                    <th>Farmaco</th>
                                                                    <th>Formula</th>
                                                                    <th>Quantita</th>
                                                                    <th>Data Inizio</th>
                                                                    <th>Data DataFine</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    el.elencoFarmaciPrescritti != [] ? el.elencoFarmaciPrescritti.map((pa) => <RowCustom colums={["formulazione.farmaco.nome", "formulazione.formula", "quantitaPrescrizione", "dataInizio", "dataFine"]} oBoB={["formulazione.formula ", "formulazione.formula.nome"]} item={pa} />) : ''
                                                                }
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </Row>
                                            )
                                        }
                                    </Row>
                                </Tab>
    }

                    </Tabs>
                </Row>
                < NotificationContainer />
            </Container>
        );
    }
}

export default NewTherapy;
