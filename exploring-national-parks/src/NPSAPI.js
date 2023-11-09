import React, {useState, useEffect} from 'react';

function Activities() {
    const [posts,setPosts] = useState([]);
    useEffect(() => {
        fetch('https://developer.nps.gov/api/v1/activities?api_key=0ilOFP8jTC2LMrwXFTullFqvHyVhBh9aHVW3OWEb')
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            setPosts(json);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }, []);

    return (
        <div className="data-container">
      {posts.data?.map((post) => {
         return (
            <div className="post-card">
               <a href="#placeholder">{post.name}</a>
            </div>
         );
      })}
            <button>Return To Home</button>
            <button>Plan A Trip</button>
        </div>
    );
}

export default Activities