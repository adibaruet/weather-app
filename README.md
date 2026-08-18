# Weather App

A simple, responsive weather application that provides current weather conditions and a 7-day forecast for any city.

Built with **vanilla HTML, CSS, and JavaScript** — no frameworks, libraries, or build tools required.

**Live Demo:** https://adibaruet.github.io/weather-app/

## Features

* Search for weather information by city name
* View current temperature and "feels like" temperature
* See humidity and wind speed
* Get a 7-day forecast with daily high and low temperatures
* Custom SVG weather icons generated directly in JavaScript
* Modern glassmorphism-inspired user interface
* Fully responsive design, including support for small phone screens
* Bengali weather descriptions and date formatting

## Built With

* **HTML, CSS & JavaScript** — vanilla JavaScript with no external dependencies
* **[Open-Meteo API](https://open-meteo.com/)** — weather and forecast data
* **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)** — converts city names into geographic coordinates

No API key is required. Both Open-Meteo APIs are free and open to use.

## Running Locally

Clone the repository and start a local development server:

```bash
git clone https://github.com/adibaruet/weather-app.git
cd weather-app
python3 -m http.server 8000
```

Then open:

**[http://localhost:8000*](https://adibaruet.github.io/weather-app/)*

A local server is recommended instead of opening `index.html` directly because browsers restrict API requests made from `file://` URLs.

## How It Works

The application uses two API requests to retrieve weather information:

1. **Geocoding** — The user's city name, such as "Dhaka", is sent to the Open-Meteo Geocoding API to obtain its latitude and longitude.
2. **Forecast** — Those coordinates are then used to request the current weather conditions and 7-day forecast from the Open-Meteo Forecast API.

Weather conditions are returned using **WMO weather codes** — for example, `0` represents clear sky while `61` represents light rain. The application maps these codes to Bengali weather descriptions and generates a corresponding SVG weather icon.

## Project Structure

```text
weather-app/
├── index.html    # Application markup
├── style.css     # Glassmorphism styling and responsive layout
└── script.js     # API requests, DOM updates, and SVG icon generation
```

## Author

**Humaira Tasnim Adiba**



