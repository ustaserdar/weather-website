const request = require('request')

const capitalize = (desc) => {
    return desc.charAt(0).toUpperCase() + desc.slice(1);
}

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=18381f5d97962132e0dd2b635f812cb0&units=metric`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.message) {
            callback(`${body.message}`, undefined)
        } else {
            callback(undefined, {
                temperature: body.main.temp,
                description: body.weather[0].description,
                text: `${capitalize(body.weather[0].description)} throughout the day. It's currently ${body.main.temp} out there but people feels like ${body.main.feels_like} degrees. This high today is ${body.main.temp_max} with a low of ${body.main.temp_min}. Humidity is ${body.main.humidity} percent so there is a 0% chance of rain.`
            })
        }
    })
}

module.exports = forecast