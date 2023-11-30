import React from 'react'
import { useState } from 'react'
import Filtering from './Filtering'
import Alerts from './Alerts'
import Banner from './Banner'
import Schedule from './Schedule'

const Parent = () => {
    const [parkCode, setParkCode] = useState(null);
    const updateParkCode = (newParkCode) => {
        setParkCode(newParkCode);
    }
  return (
    <div>
        <Banner/>
        <Filtering updateParkCode={updateParkCode}/>
        <Alerts parkCode={parkCode}/>
        <Schedule />
    </div>
  )
}

export default Parent