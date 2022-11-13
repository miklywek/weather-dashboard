var cities = [];
// Target Elements of Page
var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");
var citiesList = document.getElementById("cities-list");
var forecastContainerEl = document.getElementById("forecast-container");
var curentWeatherEl = document.getElementById("current-weather");
var cityNameEl = document.getElementById("cityName");
var imgEl = document.getElementById("img");
var temperatureEL = document.getElementById("temperature");
var humidityEl = document.getElementById("humidity");
var windSpeedEl = document.getElementById("windSpeed");
var uvIndexBoxEl = document.getElementById("uvIndex");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");
var API_KEY = "d72f1830e848bc10baf5837e373cdebc";

// UV index is a global variable
var uvi;
var callApi = function (city) {
  var urlQuery =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    API_KEY +
    "&units=imperial";
  fetch(urlQuery)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var todayDate = moment().format("dddd, MMM Do YYYY");
      // City Name and date
      cityNameEl.textContent = data.name + " " + todayDate;
      cityNameEl.setAttribute("class", "inline");
      cityNameEl.setAttribute("style", "display: block");
      var iconURL =
        "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
      imgEl.setAttribute("src", iconURL);
      imgEl.setAttribute("display", "inline");
      imgEl.setAttribute("margin-left", "1rem");

      temperatureEL.textContent = "Temperature: " + data.main.temp + "°";
      humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
      windSpeedEl.textContent = "Wind Speed: " + data.wind.speed + "MPH";

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      //   getUvIndex(lat, lon);
    });
};

// var getUvIndex = function (lat, lon) {
//   var apiURL = `https://api.openweathermap.org/data/2.5/auvi?appid=${API_KEY}&lat=${lat}&lon${lon}`;
//   fetch(apiURL).then(function (response) {
//     console.log(response);
//     if (response.ok) {
//       response.json().then(function (data) {
//         displayUvIndex(data);
//         console.log(data);
//       });
//     } else {
//       alert("Error: ");
//     }
//   });
//   console.log(lat);
//   console.log(lon);
// };
// var displayUvIndex = function (index) {
//   var uvIndexEl = document.createElement("div");
//   uvIndexEl.textContent = "UV Index:";
//   curentWeatherEl.appendChild(uvIndexEl);
// };
var get5Day = function (city) {
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`;
  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      display5Day(data);
    });
  });
};
var display5Day = function (weather) {
  forecastContainerEl.textContent = "";
  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i += 8) {
    console.log(forecast);
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";
    console.log(dailyForecast);
    //create date element
    var forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecast.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);
    //create an image element
    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );
    //append to forecast card
    forecastEl.appendChild(weatherIcon);
    //create temperature span
    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " °F";
    //append to forecast card
    forecastEl.appendChild(forecastTempEl);

    var forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
    //append to forecast card
    forecastEl.appendChild(forecastHumEl);

    forecastContainerEl.appendChild(forecastEl);
  }
};

var startHadler = function (event) {
  event.preventDefault();
  var city = searchInput.value.trim();
  if (city) {
    callApi(city);
    get5Day(city);
    cities.unshift({ city });
    searchInput.value = "";
  } else {
    alert("Please enter a City");
  }
  pastSearch(city);
  saveSearch();
  //   // Empties input box to be used again
  //   searchInput.value = "";
  // Displays the recent searches
};

var pastSearch = function (pastSearch) {
  var pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  pastSearchButtonEl.prepend(pastSearchEl);
};
var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};
var pastSearchHandler = function (event) {
  event.preventDefault();
  var city = event.target.getAttribute("data-city");
  if (city) {
    callApi(city);
    get5Day(city);
  }
};

// Click Events
searchBtn.addEventListener("click", startHadler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);
