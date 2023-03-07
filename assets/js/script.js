// API Key cc733cca9c27c80fae216f34f9353377
var currentCity = "";
var lastCity = "";

var getCurrentConditions = (event) => {
    let city = $("#search-city").val();
    currentCity = $("search-city").val();
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=cc733cca9c27c80fae216f34f9353377";
    fetch(queryURL)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        saveCity(city);

        let currentWeather="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        let currentTimeUTC = response.dt;
        let currentTimeZoneOffset = response.timezone;
        let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
        let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
        renderCities();
    })
}