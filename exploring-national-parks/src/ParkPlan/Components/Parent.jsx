import React from 'react'
import Filtering from './Filtering'
import Alerts from './Alerts'

const Parent = () => {
    const [parkCode, setParkCode] = useState(null);
    const updateParkCode = (newParkCode) => {
        setParkCode(newParkCode);
    }
  return (
    <div>
        <Filtering updateParkCode={updateParkCode}/>
        <Alerts parkCode={parkCode}/>
    </div>
  )
}

export default Parent