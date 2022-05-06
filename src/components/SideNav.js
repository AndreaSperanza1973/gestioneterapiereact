import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { role } from '../helpers/Constants';
import logo from '../logo/OA_logo.svg';


const SideNav = () => {
    const [patientId, setPatientId] = useState(window.location.pathname.split('/').pop());
    const [patientProfile, setPatientProfile] = useState([]);
    const user = JSON.parse(localStorage.getItem("role"));
    const isCarManger = user.idRole === role.CARMANAGER ? true : false
    return (
        <header className="col">
            <a href className="logo"><img src={logo} alt="OntozApp" /></a>
            <button className="menu-toggle d-block d-lg-none">
                <span />
                <span />
                <span />
            </button>
            <ul className="nav flex-column main-menu">
                {
                    //MENU LATERALE CARMANGER
                    isCarManger ?
                        <>
                            {window.location.pathname === "/Dashboard" || window.location.pathname === "/PatientRegistry" || window.location.pathname === "/ListDoctor" || window.location.pathname === "/MedicalCenter" || window.location.pathname === "/ContactInfo" || window.location.pathname === "/ContactInfoPatient" ?
                                <>
                                    <li className="nav-item">
                                        <a href="/Dashboard" className="nav-link elenco-pazienti" aria-current="page" >
                                            <p>
                                                <i class="fas fa-arrow-circle-left"></i> Home
                                            </p>
                                        </a>
                                    </li>
                                    <hr />
                                    <li className="nav-item">
                                        <a href="/ListDoctor" className="nav-link">
                                            <p>
                                                Elenco medici
                                            </p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/MedicalCenter" className="nav-link">
                                            <p>
                                                Centri Medici
                                            </p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/ContactInfo" className="nav-link">
                                            <p>
                                                Contact  Info
                                            </p>
                                        </a>
                                    </li>
                                </>
                                :
                                <>

                                    <li className="nav-item">
                                        <a href="/Dashboard" className="nav-link elenco-pazienti" aria-current="page" >
                                            <p>
                                                <i class="fas fa-arrow-circle-left"></i> Home
                                            </p>
                                        </a>
                                    </li>
                                    <hr />
                                    {localStorage.getItem("newPatient") != null ? '' :
                                        <>
                                            <li className="nav-link anagrafica-paziente">
                                                <Link to={`/PatientRegistry/${patientId}`} className="nav-link anagrafica-paziente">
                                                    <p >
                                                        Anagrafica assistito
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-link profilo-paziente">
                                                <Link to={`/PatientProfile/${patientId}`} className="nav-link profilo-paziente">
                                                    <p>
                                                        Profilo assistito
                                                    </p>
                                                </Link>
                                            </li>
                                        </>
                                    }


                                    <li className="nav-link terapia">
                                        <Link to={`/NewTherapy/${patientId}`} className="nav-link terapia">
                                            <p>
                                                Terapia
                                            </p>
                                        </Link>
                                    </li>
                                    {localStorage.getItem("newPatient") != null ? '' :
                                        <>
                                            <li className="nav-link eventi-avversi">
                                                <Link to={`/AdverseEvents/${patientId}`} className="nav-link eventi-avversi">
                                                    <p>
                                                        Eventi avversi
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-link crisi-epilettiche">
                                                <Link to={`/EpilepticSeizures/${patientId}`} className="nav-link eventi-avversi">
                                                    <p>
                                                        Crisi epilettiche
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-link esami-diagnostici">
                                                <Link to={`/DiagnosticTests/${patientId}`} className="nav-link anagrafica-medico">
                                                    <p>
                                                        Esami diagnostici
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-link visite-mediche">
                                                <Link to={`/MedicalExaminations/${patientId}`} className="nav-link visite-mediche">
                                                    <p>
                                                        Visite mediche
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link piano-nutrizionale" href="#">Piano nutrizionale</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="#" className="nav-link umore">
                                                    <p>
                                                        Umore
                                                    </p>
                                                </a>
                                            </li>
                                        </>

                                    }

                                </>
                            }
                        </>
                        :
                        ///MENU LATERALE MEDICO
                        <>
                            {window.location.pathname === "/Dashboard" ||
                                window.location.pathname === "/NewPatient" ||
                                window.location.pathname === "/DoctorProfile" ||
                                window.location.pathname === "/RichiediCodice" ||
                                window.location.pathname === "/AssociatePatient" ||
                                window.location.pathname === "/ListDoctor" ||
                                window.location.pathname === "/MedicalCenter" ||
                                window.location.pathname === "/ContactInfo"
                                ? <>
                                    <li className="nav-item">
                                        <a href="/Dashboard" className="nav-link elenco-pazienti" aria-current="page" >
                                            <p>
                                                <i class="fas fa-arrow-circle-left"></i> Home
                                            </p>
                                        </a>
                                    </li>
                                    <hr />
                                    <li className="nav-item">
                                        <Link to={`/DoctorProfile`} className="nav-link anagrafica-medico">
                                            <p>
                                                Anagrafica medico
                                            </p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/AssociatePatient" className="nav-link collega-paziente">
                                            <p>
                                                Collega paziente già assistito
                                            </p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/NewPatient" className="nav-link nuovo-paziente">
                                            <p>
                                                Nuovo paziente
                                            </p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/RichiediCodice" className="nav-link no-kit">
                                            <p>
                                                Richiedi nuovo codice assistito
                                            </p>
                                        </a>
                                    </li>
                                </>
                                : <>
                                    <li className="nav-item">
                                        <a href="/Dashboard" className="nav-link elenco-pazienti">
                                            <p>
                                                <i class="fas fa-arrow-circle-left"></i> Home
                                            </p>
                                        </a>
                                    </li>
                                    <hr />
                                    {localStorage.getItem("newPatient") != null ? '' :
                                        <>
                                            <li className="nav-item">
                                                <Link to={`/PatientRegistry/${patientId}`} className="nav-link anagrafica-paziente">
                                                    <p >
                                                        Anagrafica assistito
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to={`/PatientProfile/${patientId}`} className="nav-link profilo-paziente">
                                                    <p>
                                                        Profilo assistito
                                                    </p>
                                                </Link>
                                            </li>
                                        </>
                                    }
                                    <li className="nav-item">
                                        <Link to={`/NewTherapy/${patientId}`} className="nav-link terapia">
                                            <p>
                                                Terapia
                                            </p>
                                        </Link>
                                    </li>
                                    {localStorage.getItem("newPatient") != null ? '' :
                                        <>
                                            <li className="nav-item">
                                                <Link to={`/AdverseEvents/${patientId}`} className="nav-link eventi-avversi">
                                                    <p>
                                                        Eventi avversi
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to={`/EpilepticSeizures/${patientId}`} className="nav-link crisi-epilettiche">
                                                    <p>
                                                        Crisi epilettiche
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to={`/DiagnosticTests/${patientId}`} className="nav-link esami-diagnostici">
                                                    <p>
                                                        Esami diagnostici
                                                    </p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to={`/MedicalExaminations/${patientId}`} className="nav-link visite-mediche">
                                                    <p>
                                                        Visite mediche
                                                    </p>
                                                </Link>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link piano-nutrizionale" href="#">Piano nutrizionale</a>
                                            </li>
                                            <li className="nav-item">
                                                <Link to={`/MoodMonitoring/${patientId}`} className="nav-link umore">
                                                    <p>
                                                        Umore
                                                    </p>
                                                </Link>
                                            </li>
                                        </>
                                    }
                                </>
                            }
                        </>
                }
            </ul>
            <p className="angelini d-none d-lg-block">
                Realizzato con il contributo di
            </p>
        </header>


    )
}

export default SideNav
