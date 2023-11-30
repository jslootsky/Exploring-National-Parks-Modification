import React from 'react'
import { useEffect,useState } from 'react';   
import FetchAlerts from '../Functions/FetchAlerts';

const Alerts = ({parkCode}) => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("parkCode", parkCode[0].value);
                const json = await FetchAlerts(parkCode[0].value);
                console.log(json);
                setAlerts(json.data);
            } catch (error) {
                // Handle the error, if needed
                console.log(error);
            }
        };

        if (parkCode !== null) {
            fetchData();
        }
    }, [parkCode]);

    if (parkCode === null) {
        return null; 
    }

    // if there is no parkcode yet, this will not show up
    return (
        <div>
            <h1>Alerts</h1>
            {/* if alerts is empty, div that says 0 alerts */}
            <div>{alerts.map((alert, index) => (
                <p key={index}>{alert.title}</p>
            ))}</div>
        </div>
    )
}

export default Alerts