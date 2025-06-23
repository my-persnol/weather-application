let allCities = [];

// Load city list from JSON and populate dropdown
window.onload = function () {
  fetch('cities.json')
    .then(res => res.json())
    .then(data => {
      allCities = data;
      populateCityDropdown(allCities);
    })
    .catch(err => {
      console.error('Error loading cities:', err);
    });

  // Add search event
  document.getElementById('citySearch').addEventListener('input', function (e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    const filtered = allCities.filter(city =>
      city.name.toLowerCase().includes(searchTerm)
    );
    populateCityDropdown(filtered);
  });

  // Add search button functionality
  document.getElementById('searchBtn').addEventListener('click', function () {
    const searchTerm = document.getElementById('citySearch').value.trim().toLowerCase();
    const filtered = allCities.filter(city =>
      city.name.toLowerCase().includes(searchTerm)
    );
    populateCityDropdown(filtered);
  });
};

function populateCityDropdown(cities) {
  const citySelect = document.getElementById('citySelect');
  citySelect.innerHTML = '<option value="">--Select City--</option>';
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = JSON.stringify({ lat: city.lat, lon: city.lon });
    option.textContent = city.name;
    citySelect.appendChild(option);
  });
}

function fetchWeather() {
  const selected = document.getElementById('citySelect').value;
  if (!selected) {
    alert("Please select a city first.");
    return;
  }

  const { lat, lon } = JSON.parse(selected);

  // Show satellite image above weather output
  // NOTE: Replace with your own Mapbox public access token for production use
  const mapboxToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndjN6bWl2bGQifQ._-Q6g5w5w5w5w5w5w5w5w";
  const satelliteUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon},${lat},10/400x200?access_token=${mapboxToken}`;
  document.getElementById('weatherOutput').innerHTML = `
    <div class="satellite-img-wrap">
      <img src="${satelliteUrl}" alt="Satellite view" class="satellite-img"/>
    </div>
    <div id="weatherDetails"></div>
  `;

  // Use Open-Meteo API for accurate, global weather data
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("API call failed.");
      return response.json();
    })
    .then(data => {
      if (!data.current_weather) throw new Error("No weather data available.");
      const weather = data.current_weather;

      const outputHTML = `
        <h2>Weather Report</h2>
        <p><strong>Temperature:</strong> ${weather.temperature} °C</p>
        <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
        <p><strong>Wind Direction:</strong> ${weather.winddirection}°</p>
        <p><strong>Weather Code:</strong> ${weather.weathercode}</p>
        <p><strong>Time:</strong> ${weather.time}</p>
      `;

      document.getElementById('weatherDetails').innerHTML = outputHTML;
    })
    .catch(error => {
      document.getElementById('weatherOutput').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    });
}
