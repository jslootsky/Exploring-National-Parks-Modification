import React from 'react'
import { useState } from 'react';   
const Alerts = () => {
        const [alerts, setAlerts] = useState([]);
    return (
        <div>
                <h1>Alerts</h1>
                {alerts.length === 0 ? (
                        <div>No alerts</div>
                ) : (
                        <div>Display alerts</div>
                )}
        </div>
    )
}

export default Alerts