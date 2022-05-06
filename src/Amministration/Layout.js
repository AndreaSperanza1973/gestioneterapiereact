import React, { Component } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-datepicker/dist/react-datepicker.css";
import SideNav from '../components/SideNav';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Splash from './Splash';
import Register from './Register';
import MedicalCenter from '../CarManager/MedicalCenter';
import ListDoctor from '../CarManager/ListDoctor';
import ContactInfo from '../CarManager/ContactInfo';
import ContactInfoPatient from '../CarManager/ContactInfoPatient';
import DashboardDoctors from '../Doctor/DashboardDoctors';
import NewPatient from '../Doctor/NewPatient';
import NewTherapy from '../Doctor/NewTherapy';
import DoctorProfile from '../Doctor/DoctorProfile';
import PatientTabbedInterface from '../Doctor/PatientTabbedInterface';
import NewCode from '../Doctor/NewCode';
import AssociatePatient from '../Doctor/AssociatePatient';
import { PatientRegistry } from '../Doctor/PatientRegistry';
import { PatientProfile } from '../Doctor/PatientProfile';
import { AdverseEventsInfo } from '../Doctor/AdverseEventsTable';
import { EpilepticSeizuresInfo } from '../Doctor/EpilepticSeizuresComponent';
import { BloodTestsInfo } from '../Doctor/BloodTestsComponent';
import { PatientMoodInterface } from '../Doctor/PatientMoodInterface';
import { DiagnosticTestsInfo } from '../Doctor/DiagnosticTests';
import { MedicalExaminationsInfo } from '../Doctor/MedicalExaminations';
import { MedicalExaminationDetailsInfo } from '../Doctor/MedicalExaminationDetail';

export default class Layout extends Component {

  userLogUser = () => ({
    token: sessionStorage.getItem('token')

  });

  constructor(props) {
    super(props);
    this.state = {
      userDto: {
        ...this.userLogUser(),
      },
      url: window.location.pathname,
    }
  }

  render() {

    return (
      <>
        {localStorage.getItem("accessToken") != null && this.state.url != "/" && this.state.url != "/Register" && this.state.url != "/Login" ?
          <>

            <div class="wrapper" >
              <div class="container-lg page-wrapper">
                <div class="row flex-nowrap">
                
                  <Router>
                  
                    <SideNav></SideNav>
                    
                    <div role="main" className="col">


                      <Routes>
                        <Route path="/" element={<Splash />}></Route>
                        <Route path="/Login" element={<Login />}></Route>
                        <Route path="/Register" element={<Register />}></Route>
                        {localStorage.getItem("accessToken") != null ?
                          <>
                            <Route path="/Dashboard" element={<DashboardDoctors />}></Route>
                            <Route path="/NewPatient" element={<NewPatient />}></Route>
                            <Route path="/NewTherapy/:codicePaziente" element={<NewTherapy />}></Route>
                            <Route path="/DoctorProfile" element={<DoctorProfile />}></Route>
                            <Route path="/PatientTabbedInterface/:codicePaziente" element={<PatientTabbedInterface />}></Route>
                            <Route path="/PatientRegistry/:idPaziente" element={<PatientRegistry />}></Route>
                            <Route path="/PatientProfile/:idPaziente" element={<PatientProfile />}></Route>
                            <Route path="/AdverseEvents/:idPaziente" element={<AdverseEventsInfo />}></Route>
                            <Route path="/EpilepticSeizures/:idPaziente" element={<EpilepticSeizuresInfo />}></Route>
                            <Route path="/DiagnosticTests/:idPaziente" element={<DiagnosticTestsInfo />}></Route>
                            <Route path="/BloodTest/:idPaziente/:idTest" element={<BloodTestsInfo />}></Route>
                            <Route path="/MedicalExaminations/:idPaziente" element={<MedicalExaminationsInfo />}></Route>
                            <Route path="/MedicalExaminationDetails/:idPaziente/:idMedicalExam" element={<MedicalExaminationDetailsInfo />}></Route>
                            <Route path="/MoodMonitoring/:idPaziente" element={<PatientMoodInterface />}></Route>
                            <Route path="/DoctorProfile/:idDocotr" element={<DoctorProfile />}></Route>
                            <Route path="/MedicalCenter" element={<MedicalCenter />}></Route>
                            <Route path="/ListDoctor" element={<ListDoctor />}></Route>
                            <Route path="/ContactInfo" element={<ContactInfo />}></Route>
                            <Route path="/ContactInfoPatient/:idPatient" element={<ContactInfoPatient />}></Route>
                            <Route path="/RichiediCodice" element={<NewCode />}></Route>
                            <Route path="/AssociatePatient" element={<AssociatePatient />}></Route>
                          </>
                          : ''}
                      </Routes>
                    </div>
                  </Router>
                  
                </div></div></div>
          </> :
          <Router>
            <div role="main" className="col">
              <Routes>
                <Route path="/" element={<Splash />}></Route>
                <Route path="/Login" element={<Login />}></Route>
                <Route path="/Register" element={<Register />}></Route>
                {localStorage.getItem("accessToken") != null ?
                  <>
                    < Route path="/Dashboard" element={<DashboardDoctors />}></Route>
                    <Route path="/NewPatient" element={<NewPatient />}></Route>
                    <Route path="/NewTherapy/:codicePaziente" element={<NewTherapy />}></Route>
                    <Route path="/DoctorProfile" element={<DoctorProfile />}></Route>
                    <Route path="/PatientTabbedInterface/:codicePaziente" element={<PatientTabbedInterface />}></Route>
                    <Route path="/PatientRegistry/:idPaziente" element={<PatientRegistry />}></Route>
                    <Route path="/PatientProfile/:idPaziente" element={<PatientProfile />}></Route>
                    <Route path="/AdverseEvents/:idPaziente" element={<AdverseEventsInfo />}></Route>
                    <Route path="/DiagnosticTests/:idPaziente" element={<DiagnosticTestsInfo />}></Route>
                    <Route path="/BloodTest/:idPaziente/:idTest" element={<BloodTestsInfo />}></Route>
                    <Route path="/MedicalExaminations/:idPaziente" element={<MedicalExaminationsInfo />}></Route>
                    <Route path="/MedicalExaminationDetails/:idPaziente/:idMedicalExam" element={<MedicalExaminationDetailsInfo />}></Route>
                    <Route path="/MoodMonitoring/:idPaziente" element={<PatientMoodInterface />}></Route>
                  </>
                  : ''}
              </Routes>
            </div>
          </Router>
        }
      </>
    )
  }
}
