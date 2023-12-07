import React from 'react'
import ParkPlanParent from './ParkPlan/Components/Parent'
import Banner from './ParkPlan/Components/Banner'
const ParkPlan = () => {
  return (
    <div className="park-plan">
      
      <Banner/>
      <ParkPlanParent />
    </div>
  )
}

export default ParkPlan