import React, { useState, useEffect } from 'react';
import '../../Style/parkVideos.css';

const ParkVideos = ({ parkCode }) => {
    const [Videos, setVideos] = useState([]);

    const fetchVideos = async () => {
        try {

            const response = await fetch(
                `https://developer.nps.gov/api/v1/multimedia/videos?parkCode=${parkCode}&api_key=Y7kFnm6SP5SMQhkTvwUSgyjge9buj4DbjrkuV2S0`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const data = await response.json();

            console.log('Fetched videos:', data);

            // Filter videos with a splash image
            const videosWithSplash = data.data.filter(
                (video) => video.splashImage && video.splashImage.url
            );

            console.log('Videos with splash image:', videosWithSplash);

            if (videosWithSplash.length === 0) {
                console.log('No videos with splash image found');
            }

            // // shuffle the array of videos with splash images + pick the first three
            // const VideosArray = videosWithSplash.sort(() => Math.random() - 0.5).slice(0, 3);

            // sort videos by title
            const selectedVideos = videosWithSplash.sort((a, b) => {
                if (a.title < b.title) {
                    return -1;
                }
                if (a.title > b.title) {
                    return 1;
                }
                return 0;
            });

            console.log('Videos Selected:', selectedVideos);

            setVideos(selectedVideos);
        } catch (error) {
            console.error('Error fetching or processing videos:', error);
        } finally {
            console.log('Done fetching videos');
        }
    };

    const handlePlayClick = (index) => {
        setVideos((prevVideos) => {
            const updatedVideos = prevVideos.map((video, i) => {
                i === index ? (video.playing = true) : (video.playing = false);
                return video;
            });
            return updatedVideos;
        });
    };

    // Fetch random videos on component mount
    useEffect(() => {
        fetchVideos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parkCode]);


    return (
        <div className = "park-videos">
            {Videos.length > 0 && 
            (
                <div className="videos">
                    <h2>Videos</h2>
                    <div>
                        {Videos.map((video, index) => 
                        (
                            <div key={video.id}>
                                <p>{video.title}</p>
                                <p>{video.description}</p>
                                <div className="video-container">
                                    {video.splashImage && 
                                        (
                                        <img src={video.splashImage.url} alt={`Splash for ${video.title}`} className="video-image"/>
                                        )
                                    }
                                    {!video.playing &&
                                        (
                                            <div className="play-button" onClick={() => handlePlayClick(index)}>
                                                <p className="play-icon">▶</p>
                                            </div>
                                        )
                                    }
                                    {video.playing &&
                                        (
                                            <iframe title={video.title} width="100%" height="100%" src={video.versions[0].url} allowFullScreen allow="autoplay; encrypted-media"></iframe>
                                        )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <br/>
        </div>
    );
};
export default ParkVideos;
