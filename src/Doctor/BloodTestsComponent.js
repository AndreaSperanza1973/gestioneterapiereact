import { Col, Table, Form, Button, Container, Row, Carousel } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../helpers/api/api';
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import moment from 'moment';
import { path } from '../helpers/Constants';
import { patient } from '../helpers/api/api';
import { DiagnosticTestSlider } from './DiagnosticTestSlider';

function BloodTestsInfo() {
    const location = useLocation();
    const selectedDiagnosticTest = location.state;
    const selectedPatientId = location.patientId;
    const [imgsNames, setImgsNames] = useState([]);
    const [diagnosticTest, setDiagnosticTest] = useState(selectedDiagnosticTest);
    const [patientId, setPatientId] = useState(selectedPatientId);
    const navigate = useNavigate();

    // const [diagnosticTestId, setDiagnosticTestId] = useState(window.location.pathname.split('/').pop());
    // const [diagnosticTests, setDiagnosticTests] = useState([]);
    // const [patientProfile, setPatientProfile] = useState([]);

    useEffect(() => {
        const fetchImgsNames = async () => {
            await patient.get("GetFileName/", window.location.pathname.split('/').pop())
                .then((response) => {
                    if (response.status === 200) {
                        setImgsNames(response.data.dati);
                    }
                }).catch((error) => {

                });
        };
        fetchImgsNames();
    }, []);

    return (
        <>
            <h2>Dettaglio esame diagnostico</h2>
            &nbsp;&nbsp;
            <div className="row h-100 w-100 justify-content-center align-items-center">
                <div className="col-12 col-md-6" >
                    <div className="box carousel">
                        <p className="text-center px-3">Immagini inviate</p>

                        <DiagnosticTestSlider imgsNames={imgsNames}/>

                    </div>
                </div>
                <div className="col-12 col-md-7 overlap-md-1">
                    <div className="box carousel-info">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="data-label">Data</span>
                            <input type="data" className="form-control form-control-sm" id="data" aria-describedby="data-label" value={moment(diagnosticTest.uploadedDateTime).format("DD/MM/YYYY")} disabled />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="tiporeferto-label">Tipo di referto</span>
                            <input type="text" className="form-control form-control-sm" id="tiporeferto" aria-describedby="tiporeferto-label" value={diagnosticTest.tipoReferto} disabled />
                        </div>
                    </div>
                </div>
            </div>
            {/* <Row>
                <Col>
                    <ControlledCarouselBloodTests selectedDiagnosticTest={selectedDiagnosticTest} imgsNames={imgsNames} />
                </Col>
                <Col>
                    <div><strong>Referto del:</strong> {moment(diagnosticTest.uploadedDateTime).format("DD/MM/YYYY")}</div>
                    &nbsp;&nbsp;
                    <BloodTestTable />
                </Col>
            </Row>
            <div className='mb-3'>
                <Button type='submit' onClick={() => navigate(-1)}>Torna a elenco esami </Button>
            </div> */}

        </>
    );
}




function ControlledCarouselBloodTests(props) {

    const [index, setIndex] = useState(0);
    const imgsFolder = props.selectedDiagnosticTest.idBloodData + "/";
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
            {props.imgsNames?.map((imgName, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="selectedDiagnosticTestImages d-block w-100"
                        src={imgName}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

function BloodTestTable(response) {
    return (
        <>
            <div className='col-6'>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>

                            <th>Esame</th>
                            <th>Valore</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            response.data?.map((drugNameConcentration) => <BloodTestRow key={drugNameConcentration.id} drugNameConcentration={drugNameConcentration} />)
                        }
                    </tbody>
                </Table>
            </div>



        </>
    );
}

function BloodTestRow(props) {
    return <tr><BloodTestRowData drugNameConcentration={props.drugNameConcentration} /></tr>
}

function BloodTestRowData(props) {
    return (<>
        <td>{props.drugNameConcentration.name === 0 ? "dataEvento" : "dataEvento"}</td>
        <td>{props.drugNameConcentration.concentration === 0 ? "disturboEvento" : "disturboEvento"}</td>

    </>
    );
}






export { BloodTestsInfo };