const WEATHER_API_KEY = 'de034229755b4a729a451812252910'; 

const locations = [
  {
    id: 'mirny',
    name: 'Мирный',
    query: 'Mirny, Russia',
    coords: [62.5317, 113.9817]
  },
  {
    id: 'udachny',
    name: 'Удачный',
    query: 'Udachny, Russia',
    coords: [66.4067, 112.4083]
  },
  {
    id: 'aykhal',
    name: 'Айхал',
    query: 'Aikhal, Russia',
    coords: [65.9467, 116.5383]
  }
];

// Элементы DOM
const tempElements = document.querySelectorAll('.temp');
const windElements = document.querySelectorAll('.wind');
const checkBtn = document.getElementById('check-btn');
const statusEl = document.getElementById('status');
const recommendationEl = document.getElementById('recommendation');
const errorEl = document.getElementById('error');

// Данные погоды (заполняются после API-запроса)
let weatherData = {};

// Функция: запросить погоду для локации
async function fetchWeather(location) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${de034229755b4a729a451812252910}&q=${location.query}&lang=ru`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка API для ${location.name}: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      temp: data.current.temp_c,
      wind: data.current.wind_kph / 3.6 // км/ч → м/с
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Функция: обновить интерфейс
function updateDisplay() {
  locations.forEach(loc => {
    const data = weatherData[loc.id];
    const index = locations.findIndex(l => l.id === loc.id);
    
    tempElements[index].textContent = data.temp.toFixed(1);
    windElements[index].textContent = data.wind.toFixed(1);
  });
}

// Функция: инициализировать карту
function initMap() {
  const map = new ymaps.Map('map', {
    center: [65.0, 114.0],
    zoom: 5,
    controls: []
  });

  Object.keys(weatherData).forEach(key => {
    const loc = locations.find(l => l.id === key);
    const { temp, wind } = weatherData[key];
    
    const placemark = new ymaps.Placemark(loc.coords, {
      balloonContent: `
        <b>${loc.name}</b><br>
        Температура: ${temp.toFixed(1)} °C<br>
        Ветер: ${wind.toFixed(1)} м/с
      `
    });
    map.geoObjects.add(placemark);
  });
}

// Функция: проверить безопасность
function checkSafety() {
  let allSafe = true;
  let hasWindIssue = false;
  let hasTempIssue = false;

  Object.keys(weatherData).forEach(key => {
    const { temp, wind } = weatherData[key];
    if (wind > 15) hasWindIssue = true;
    if (temp < -45) hasTempIssue = true;
  });

  if (hasWindIssue) {
    allSafe = false;
    statusEl.textContent = 'ОПАСНОСТЬ';
    statusEl.className = 'danger';
    recommendationEl.textContent = 'Полёты запрещены: скорость ветра > 15 м/с в одной из зон.';
  } else if (hasTempIssue) {
    allSafe = false;
    statusEl.textContent = 'ОПАСНОСТЬ';
    statusEl.className = 'danger';
    recommendationEl.textContent = 'Работы приостановлены: температура < −45 °C в одной из зон.';
  } else {
    statusEl.textContent = 'БЕЗОПАСНО';
    statusEl.className = 'safe';
    recommendationEl.textContent = 'Полёт разрешён. Все параметры в норме.';
  }
}

// Основная функция: загрузить погоду и обновить интерфейс
async function loadWeatherData() {
  errorEl.style.display = 'none';
  
  try {
    const results = await Promise.all(
      locations.map(loc => fetchWeather(loc))
    );
    
    // Сопоставляем результаты с ID локаций
    locations.forEach((loc, index) => {
      weatherData[loc.id] = results[index];
    });
    
    updateDisplay();
    initMap();
  } catch (err) {
    errorEl.textContent = `Ошибка загрузки данных: ${err.message}`;
    errorEl.style.display = '