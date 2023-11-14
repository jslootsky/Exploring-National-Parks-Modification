import React from "react";
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import HomePage from "./HomePage";
import ParkSearch from "./ParkSearch";

function App() {
    return (
        
        <Router>
            <div>
                <Routes>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route path="/ParkSearch">
                        <ParkSearch />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;