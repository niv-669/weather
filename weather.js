const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityHide = document.querySelector('.city-hide');

search.addEventListener('click', () => {

    const APIkey ='ce8e046959951e7aa53a05b6497c8f06';
    const city = document.querySelector('.search-box input').value;

    if (city == '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`).then(response => response.json()).then(json => {

        if(json.cod == '404'){
            cityHide.textContent = city;
            container.style.height = '400px';
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
            error404.classList.add('active');
            return;
        }

        const image = document.querySelector('.weather-box img');
        const temperature = document.querySelector('.weather-box .temperature');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');

        if (cityHide.textContent == city){
            return;
        }
        else{
            cityHide.textContent = city;

            container.style.height = '555px';
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            error404.classList.remove('active');

            // setTimeout(() => {
            //     container.classList.remove('active');
            // },2500);

            switch (json.weather[0].main){
                case 'Clear':
                    image.src = 'images/clear.png';
                break;
    
                case 'Rain':
                    image.src = 'images/rain.png';
                break;
    
                case 'Snow':
                    image.src = 'images/snow.png';
                break;
    
                case 'Clouds':
                    image.src = 'images/cloud.png';
                break;
    
                case 'Mist':
                    image.src = 'images/mist.png';
                break;

                case 'Haze':
                    image.src = 'images/mist.png';
                break;
    
                default:
                    image.src = 'images/cloud.png';
            }
    
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}km/h`;

            // Update forecast for the searched city
            getForecast(city);

    }  

    });
    
});


function getForecast(city) {
  const apiKey = "ce8e046959951e7aa53a05b6497c8f06";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.getElementById("forecast-container");
      forecastContainer.innerHTML = "";

      const dailyData = {};
      data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyData[date]) {
          dailyData[date] = entry;
        }
      });

      const days = Object.keys(dailyData).slice(0, 5);
      days.forEach(date => {
        const entry = dailyData[date];
        const condition = entry.weather[0].main;
        const iconMap = {
          Clear: 'clear.png',
          Clouds: 'cloud.png',
          Rain: 'rain.png',
          Drizzle: 'rain.png',
          Thunderstorm: 'rain.png',
          Snow: 'snow.png',
          Mist: 'mist.png',
          Smoke: 'mist.png',
          Haze: 'mist.png',
          Fog: 'mist.png'
        };
        const icon = iconMap[condition] || 'cloud.png';
        const card = document.createElement("div");
        card.className = "forecast-card";
card.innerHTML = `
  <h4>${date}</h4>
  <img src="images/${icon}" alt="${condition}" width="48" height="48">
  <p>${condition}</p>
  <p>🌡️ ${entry.main.temp}°C</p>
  <p>💨 ${entry.wind.speed} km/h</p>
`;
forecastContainer.appendChild(card);
      });
    })  
    .catch(err => {
      console.error("Forecast error:", err);
    });
}

// Call forecast for default city shown
document.addEventListener("DOMContentLoaded", () => {
  const cityName = document.querySelector(".city")?.textContent || "";
  getForecast(cityName);
});
