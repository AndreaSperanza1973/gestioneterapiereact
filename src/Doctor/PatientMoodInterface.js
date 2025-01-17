import { useState, useEffect } from 'react';
import { Tabs, Tab, Form, Button, Row } from 'react-bootstrap';
import { patient } from '../helpers/api/api';
import { entitiesLabels, message } from '../helpers/Constants';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { PatientWeeklyMood } from './PatientWeeklyMood';
import { PatientDailyMood } from './PatientDailyMood';

function PatientMoodInterface(props) {
    const [key, setKey] = useState('dailyMoodMonitoring');
    const [patientId, setPatientId] = useState(window.location.pathname.split('/').pop());
    const [patientProfile, setPatientProfile] = useState([]);
    const [patientDailyMoods, setPatientDailyMoods] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            await patient.get("Get/", patientId)
                .then((response) => {
                    if (response.status === 200) {
                        setPatientProfile(response.data.dati);
                    }
                }).catch((error) => {

                });
        };
        fetchPatient();
    }, []);

    useEffect(() => {
        const fetchPatientDailyMoods = async () => {
            setLoading(true);
            await patient.get("DailyMoodTracking/", patientId)
                .then((response) => {
                    if (response.status === 200) {
                        setPatientDailyMoods(response.data.dati);
                        setLoading(false);
                    }
                }).catch((error) => {

                });
        };
        fetchPatientDailyMoods();
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <>
                <h1 className="h1">Umore</h1>
                &nbsp;&nbsp;
                
                <Tabs
                    id="mood-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="nav secondary-menu mb-4"
                >
                    <Tab eventKey="dailyMoodMonitoring" title="Umore quotidiano">
                        <PatientDailyMood patientDailyMoods={patientDailyMoods} />
                    </Tab>
                    <Tab eventKey="weeklyMoodMonitoring" title="Umore settimanale" >
                        <PatientWeeklyMood />
                    </Tab>
                </Tabs>
                < NotificationContainer />
        </>

    );
}


export { PatientMoodInterface }
