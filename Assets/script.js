var cityInput = document.getElementById("cityInput");
var searchBtn = document.getElementById("searchBtn");
var searchHistory = document.getElementById("searchHistory");
var currentCity = document.getElementById("currentCity");
var weatherIcon = document.getElementById("weatherIcon");
var currentTemperature = document.getElementById("currentTemperature");
var currentHumidity = document.getElementById("currentHumidity");
var currentWindSpeed = document.getElementById("currentWindSpeed");

var southernTexasCitys = [
  { name: "Webster", lat: 29.5377, lon: -95.1183 },
  { name: "Lake Jackson", lat: 29.0338, lon: -95.4344 },
  { name: "Port Arthur", lat: 29.8849, lon: -93.9399 },
  { name: "Pasadena", lat: 29.6911, lon: -95.2091 },
  { name: "Nassau Bay", lat: 29.5419, lon: -95.0894 },
];

var API_KEY = "1ee679158fc39ec6485ef9e91e4c5172";

searchBtn.addEventListener("click", function () {
  var city = cityInput.value;
  if (city) {
    getWeatherData(city);
    addToSearchHistory(city);
  } else {
    alert("Enter a City Name");
  }
});
function getWeatherData(city) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    API_KEY +
    "&units=metric";
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      return fetch(
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          API_KEY +
          "&units=metric"
      );
    })
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data.list);
    })
    .catch((err) => console.error("Error fetching data:", err));
}
function addTexasCityButtons() {
  var texasCityContainer = document.getElementById("southernTexasCities");
  texasCityContainer.innerHTML = "";

  southernTexasCitys.forEach((city) => {
    var button = document.createElement("button");
    button.classList.add("btn", "btn-secondary", "btn-block", "mb-1");
    button.textContent = city.name;
    button.onclick = function () {
      getWeatherDataByCoords(city.lat, city.lon);
    };
    texasCityContainer.appendChild(button);
  });
}

function getWeatherDataByCoords(lat, lon) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    API_KEY +
    "&units=metric";

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      return fetch(
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          API_KEY +
          "&units=metric"
      );
    })
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data.list);
    })
    .catch((err) => console.error("Error fetching data:", err));
}

function displayCurrentWeather(data) {

  var tempFahrenheit = (data.main.temp * 9) / 5 + 32;
  currentCity.textContent = data.name + ", " + new Date().toLocaleDateString();
  weatherIcon.src =
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
  currentTemperature.textContent =
    "Temperature: " + tempFahrenheit.toFixed(1) + "°F";
  currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
  currentWindSpeed.textContent = "Wind Speed: " + data.wind.speed + " km/h";
}

  function displayForecast(forecastData) {
    var forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = ""; // clear previous forecasts

    for (var i = 4, j = 0; i < forecastData.length && j < 5; i += 8, j++) {
      var dayData = forecastData[i];

      // Card creation logic
      var cardColumn = document.createElement("div");
      cardColumn.className = "custom-column";

      var card = document.createElement("div");
      card.className = "card";

      var cardBody = document.createElement("div");
      cardBody.className = "card-body small";

      var cardTitle = document.createElement("h5");
      cardTitle.className = "card-title forecast-city";
      cardTitle.textContent = new Date(dayData.dt * 1000).toLocaleDateString();

      var cardIcon = document.createElement("img");
      cardIcon.src =
        "https://openweathermap.org/img/wn/" + dayData.weather[0].icon + ".png";
      cardIcon.className = "forecast-icon mb-2";
      cardIcon.alt = "Weather Icon";

      var cardTemp = document.createElement("p");
      cardTemp.className = "card-text forecast-temperature";
      cardTemp.textContent =
        "Temperature: " + ((dayData.main.temp * 9) / 5 + 32).toFixed(1) + "°F";

      var cardHumidity = document.createElement("p");
      cardHumidity.className = "card-text forecast-humidity";
      cardHumidity.textContent = "Humidity: " + dayData.main.humidity + "%";

      var cardWindSpeed = document.createElement("p");
      cardWindSpeed.className = "card-text forecast-wind-speed";
      cardWindSpeed.textContent = "Wind Speed: " + dayData.wind.speed + " km/h";

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardIcon);
      cardBody.appendChild(cardTemp);
      cardBody.appendChild(cardHumidity);
      cardBody.appendChild(cardWindSpeed);

      card.appendChild(cardBody);
      cardColumn.appendChild(card);

      forecastContainer.appendChild(cardColumn);
    }
  }

function addToSearchHistory(city) {
  var listItem = document.createElement("button");
  listItem.classList.add("list-group-item", "list-group-item-action");
  listItem.textContent = city;
  listItem.addEventListener("click", function () {
    getWeatherData(city);
  });
  searchHistory.appendChild(listItem);
}
addTexasCityButtons();
