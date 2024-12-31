const express = require("express");
const fetch = require("node-fetch"); 
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');
const hbs = require('hbs');

// Public static path
const staticPath = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.use(express.static(staticPath));

const apiKey = "2a8eaaf2ffb6838150531d542c0fcd47";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Routes
app.get("/", (req, res) => {
    res.render('index');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/weather", (req, res) => {
    res.render('weather');
});
app.get("/contact", (req, res) => {
    res.render('contact');
});

// Weather API endpoint
app.get("/weather-data", async (req, res) => {
    const city = req.query.city || "Kathmandu"; // Default city
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (response.status === 404) {
            res.render('weather', { error: "Invalid City Name" });
        } else {
            const data = await response.json();
            const weatherData = {
                city: data.name,
                temp: Math.round(data.main.temp),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                weatherMain: data.weather[0].main,
                weatherIcon: getWeatherIcon(data.weather[0].main)
            };
            res.render('weather', { weather: weatherData });
        }
    } catch (error) {
        res.render('weather', { error: "Error fetching data" });
    }
});

// 404 route
app.get("*", (req, res) => {
    res.render('404error');
});

app.listen(port, () => {
    console.log(`Server running successfully at port ${port}`);
});

// Helper function to get the appropriate weather icon
function getWeatherIcon(weatherMain) {
    switch (weatherMain) {
        case "Clouds":
            return "images/clouds.png";
        case "Clear":
            return "images/clear.png";
        case "Rain":
            return "images/rain.png";
        case "Drizzle":
            return "images/drizzle.png";
        case "Mist":
            return "images/mist.png";
        default:
            return "images/default.png";
    }
}
