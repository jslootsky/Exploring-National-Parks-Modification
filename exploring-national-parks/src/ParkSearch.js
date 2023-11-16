import React from 'react';
import ActivitiesList from './ParkSearch/Components/ActivitiesList.jsx';
function ParkSearch(){
    return(
    <div className = "main-component" id = "search-component" onload="document.this.style.opacity='1'">
        <ActivitiesList />
    </div>
    );
}

export default ParkSearch;