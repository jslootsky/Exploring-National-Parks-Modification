import React from 'react'
import { useState } from 'react'
import Filtering from './Filtering'
import Alerts from './Alerts'
import Banner from './Banner'
import Schedule from './Schedule'

const Parent = () => {
    const [parkCode, setParkCode] = useState(null);
    const [dates, setDates] = useState(null);
    const updateParkCode = (newParkCode) => {
        setParkCode(newParkCode);
    }
    const updateDates = (newDates) => {
        setDates(newDates);
    }
  return (
    <div>
        <Banner/>
        <Filtering updateParkCode={updateParkCode} updateDates={updateDates}/>
        <Alerts parkCode={parkCode}/>
        <Schedule dates={dates} parkCode={parkCode} />
    </div>
  )
}

export default Parent