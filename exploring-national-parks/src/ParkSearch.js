import React from 'react';
import ActivitiesList from './ParkSearch/Components/ActivitiesList.jsx';
import ParkSearchWelcome from './ParkSearch/Components/ParkSearchWelcome.jsx';
import './Style/parkSearch.css';
function ParkSearch(){
    return(
    <div className='park-search' >
        <ParkSearchWelcome />
        <ActivitiesList />
    </div>
    );
}

export default ParkSearch;