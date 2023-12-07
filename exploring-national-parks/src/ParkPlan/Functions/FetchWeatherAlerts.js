export const FetchWeatherAlerts = async (parkCode) => {
    try {

        const alertResponse = await fetch(`https://api.weather.gov/alerts?point=${parkCode.latitude}%2C${parkCode.longitude}&limit=500`);
        const alertData = await alertResponse.json();
        let alerts = [];
        if (alertData.features && alertData.features.length > 0) {
            console.log(alertData.features[0].properties.description);
            // append to alerts

            alerts.push(alertData.features[0].properties.description);

         
        }
        return alerts;
    } catch (error) {
        console.log(error);

    }

}
