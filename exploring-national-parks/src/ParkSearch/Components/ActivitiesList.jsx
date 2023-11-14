// ActivitiesComponent.jsx
import React, { useState, useEffect } from 'react';
import { Activities } from '../Functionality/Activities'; // Importing the functionality
import '../../Style/activitiesList.css';

function ActivitiesList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const json = await Activities();
                console.log(json);
                setPosts(json.data);
            } catch (error) {
                // Handle the error, if needed
            }
        };

        fetchData();
    }, []);

    return (
        <div className='activitiesList'>

            <center>
                <h1>Exploring National Parks</h1>
                <input type="text" placeholder="Search for activities..." id="activityInput"></input>
            </center>
            <br></br>
            <div className="activities">

                {posts?.map((post) => (
                    <div key={post.id} className="post-card">
                        <a href="#placeholder">{post.name}</a>
                    </div>
                ))}
                <button>Return To Home</button>
                <button>Plan A Trip</button>
            </div>
        </div>
    );
}

export default ActivitiesList;
