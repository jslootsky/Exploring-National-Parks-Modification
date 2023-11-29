import React from 'react'
import Banner from './ParkPlan/Components/Banner'
import Filtering from './ParkPlan/Components/Filtering'
import Alerts from './ParkPlan/Components/Alerts'
const ParkPlan = () => {
  return (
    <div>
      <Banner />
      <Filtering />
      <Alerts></Alerts>
    </div>
  )
}

export default ParkPlan