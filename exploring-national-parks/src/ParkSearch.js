import React from 'react';
import ActivitiesList from './ParkSearch/Components/ActivitiesList.jsx';
import ParkSearchWelcome from './ParkSearch/Components/ParkSearchWelcome.jsx';
import './Style/parkSearch.css';
function ParkSearch(){
    return(
    <div className='park-search' onLoad="document.this.style.opacity='1'">
        <ParkSearchWelcome />
        <ActivitiesList />
    </div>
    );
}

export default ParkSearch;