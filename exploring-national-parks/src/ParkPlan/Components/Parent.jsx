import React from 'react'
import { useState } from 'react'
import Filtering from './Filtering'
import Alerts from './Alerts'
import Schedule from './Schedule'

const Parent = () => {
    const [parkCode, setParkCode] = useState(null);
    const [dates, setDates] = useState(null);
    const [activities, setActivities] = useState(null);
    const updateParkCode = (newParkCode) => {
        setParkCode(newParkCode);
    }
    const updateActivities = (newActivities) =>  {
      console.log("set activity",newActivities);
      setActivities(newActivities);
    }
    const updateDates = (newDates) => {
      console.log("set date",newDates);
        setDates(newDates);
    }
  return (
    <div>
        <Filtering updateParkCode={updateParkCode} updateDates={updateDates} updateActivities={updateActivities}/>
        <Alerts parkCode={parkCode}/>
        <Schedule dates={dates} parkCode={parkCode} activities={activities}/>
    </div>
  )
}

export default Parent