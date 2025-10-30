// Конфигурация локаций
const locations = [
  {
    id: 'mirny',
    name: 'Мирный',
    coords: [62.534, 113.961],
    apiUrl: 'https://api.openweathermap.org/data/2.5/weather?lat=62.534&lon=113.961&appid=bd5e378503939ddaee76f12ad7a97608&units=metric&lang=ru'
  },
  {
    id: 'udachny',
    name: 'Удачный',
    coords: [66.407, 112.297],
    apiUrl: 'https://api.openweathermap.org/data/2.5/weather?lat=66.407&lon=112.297&appid=bd5e378503939ddaee76f12ad7a97608&units=metric&lang=ru'
  },
  {
    id: 'aykhal',
    name: 'Айхал',
    coords: [65.938, 111.487],
    apiUrl: 'https://api.openweathermap.org/data/2.5/weather?lat=65.938&lon=111.487&appid=bd5e378503939ddaee76f12ad7a97608&units=metric&lang=ru'
  }
];

// Функция для получения данных о погоде
async function fetchWeatherData(location) {
  try {
    // В реальном приложении здесь был бы fetch к API
    // Для демонстрации генерируем реалистичные данные
    return generateRealisticWeatherData(location);
  } catch (error) {
    console.error(`Ошибка получения данных для ${location.name}:`, error);
    return null;
  }
}

// Генерация реалистичных погодных данных
function generateRealisticWeatherData(location) {
  const baseTemp = location.id === 'mirny' ? -25 : -18;
  const tempVariation = Math.random() * 10 - 5; // -5 до +5
  const temperature = Math.round((baseTemp + tempVariation) * 10) / 10;
  
  const windSpeed = Math.round((3 + Math.random() * 8) * 10) / 10;
  const humidity = Math.round(70 + Math.random() * 25);
  const pressure = Math.round(980 + Math.random() * 40);
  
  // Определяем статус безопасности
  let safetyStatus = 'safe';
  let statusText = 'БЕЗОПАСНО';
  
  if (windSpeed > 12 || temperature < -40) {
    safetyStatus = 'danger';
    statusText = 'ОПАСНО';
  } else if (windSpeed > 8 || temperature < -30) {
    safetyStatus = 'warning';
    statusText = 'ВНИМАНИЕ';
  }
  
  // Определяем иконку погоды
  let weatherIcon = 'fa-sun';
  if (temperature < -10) weatherIcon = 'fa-snowflake';
  else if (humidity > 85) weatherIcon = 'fa-cloud';
  else if (windSpeed > 6) weatherIcon = 'fa-wind';
  
  return {
    temperature,
    windSpeed,
    humidity,
    pressure,
    safetyStatus,
    statusText,
    weatherIcon
  };
}

// Обновление интерфейса с данными о погоде
function updateWeatherUI(location, data) {
  if (!data) return;
  
  const locationElement = document.getElementById(location.id);
  if (!locationElement) return;
  
  // Обновляем значения
  locationElement.querySelector('.temp').textContent = `${data.temperature}°C`;
  locationElement.querySelector('.wind').textContent = `${data.windSpeed} м/с`;
  locationElement.querySelector('.hum').textContent = `${data.humidity}%`;
  locationElement.querySelector('.pres').textContent = `${data.pressure} гПа`;
  
  // Обновляем иконку погоды
  const iconElement = locationElement.querySelector('.weather-icon i');
  iconElement.className = `fas ${data.weatherIcon}`;
  
  // Обновляем статус безопасности
  const statusElement = document.getElementById(`${location.id}-status`);
  statusElement.textContent = data.statusText;
  statusElement.className = `status ${data.safetyStatus}`;
}

// Инициализация карты
function initMap() {
  ymaps.ready(function() {
    const map = new ymaps.Map('map', {
      center: [65.0, 114.0],
      zoom: 5,
      controls: ['zoomControl', 'fullscreenControl']
    });
    
    // Добавляем метки для каждой локации
    locations.forEach(location => {
      const placemark = new ymaps.Placemark(location.coords, {
        balloonContent: `<b>${location.name}</b><br>Метеостанция АЛРОСА`
      }, {
        preset: 'islands#blueCircleDotIcon'
      });
      
      map.geoObjects.add(placemark);
    });
  });
}

// Основная функция инициализации
async function initWeatherStation() {
  // Инициализируем карту
  initMap();
  
  // Загружаем данные о погоде для каждой локации
  for (const location of locations) {
    const weatherData = await fetchWeatherData(location);
    updateWeatherUI(location, weatherData);
    
    // Добавляем небольшую задержку для имитации реального API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Обновляем данные каждые 10 секунд
  setInterval(async () => {
    for (const location of locations) {
      const weatherData = await fetchWeatherData(location);
      updateWeatherUI(location, weatherData);
    }
  }, 30000); // 30 секунд
}

// Запускаем приложение после загрузки страницы
document.addEventListener('DOMContentLoaded', initWeatherStation);