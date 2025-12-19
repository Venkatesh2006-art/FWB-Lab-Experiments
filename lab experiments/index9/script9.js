const loadTripsBtn = document.getElementById("loadTripsBtn");
const loadWeatherBtn = document.getElementById("loadWeatherBtn");
const statusText = document.getElementById("statusText");
const tripsContainer = document.getElementById("tripsContainer");
const weatherContainer = document.getElementById("weatherContainer");
const headerInfo = document.getElementById("header-info");

// Simple mapping to act like "travel destinations"
const cityByUserId = {
  1: "Paris",
  2: "London",
  3: "New York",
  4: "Tokyo",
  5: "Andhra Pradesh"
};

/* ========== 1. Async/Await with fetch ========== */
async function loadTrips() {
  try {
    statusText.textContent = "Loading trips using async/await...";
    loadTripsBtn.disabled = true;

    // Fake "trips" from users API
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    // Take first 5 users as example trips
    const trips = users.slice(0, 5).map((user) => ({
      id: user.id,
      city: cityByUserId[user.id] || "Unknown",
      traveler: user.name,
      email: user.email,
      description: `Explore ${cityByUserId[user.id] || "this city"} with ${user.name}.`
    }));

    renderTrips(trips);
    headerInfo.textContent = "Trips loaded with async/await";
    statusText.textContent = "Trips loaded successfully.";
  } catch (error) {
    console.error(error);
    statusText.textContent = "Error loading trips.";
  } finally {
    loadTripsBtn.disabled = false;
  }
}

function renderTrips(trips) {
  tripsContainer.innerHTML = "";
  trips.forEach((trip) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${trip.city}</h3>
      <p>${trip.description}</p>
      <p class="small">Traveler: ${trip.traveler} (${trip.email})</p>
    `;
    tripsContainer.appendChild(div);
  });
}

/* ========== 2. Promise chaining with fetch ========== */
function loadWeather() {
  statusText.textContent = "Loading weather using Promise chaining...";
  loadWeatherBtn.disabled = true;

  // First API call: fetch some posts (acts as trip list)
  fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then((res) => res.json())
    .then((posts) => {
      // Second step: for each post, create a fake "weather" promise
      const weatherPromises = posts.map((post, index) => {
        const cityNames = ["Paris", "London", "New York", "Tokyo", "Andhra Pradesh"];
        const city = cityNames[index % cityNames.length];

        // Simulate async "weather API" response
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              city,
              temp: (20 + Math.floor(Math.random() * 10)) + " °C",
              condition: ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)],
              note: post.title
            });
          }, 500 + index * 200);
        });
      });

      // Chain with Promise.all to wait for all weather requests
      return Promise.all(weatherPromises);
    })
    .then((weatherList) => {
      renderWeather(weatherList);
      headerInfo.textContent = "Weather loaded with Promise chaining";
      statusText.textContent = "Weather loaded successfully.";
    })
    .catch((error) => {
      console.error(error);
      statusText.textContent = "Error loading weather.";
    })
    .finally(() => {
      loadWeatherBtn.disabled = false;
    });
}

function renderWeather(weatherList) {
  weatherContainer.innerHTML = "";
  weatherList.forEach((w) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${w.city}</h3>
      <p>Temperature: ${w.temp}</p>
      <p>Condition: ${w.condition}</p>
      <p class="small">Note: ${w.note}</p>
    `;
    weatherContainer.appendChild(div);
  });
}

// Event listeners
loadTripsBtn.addEventListener("click", loadTrips);
loadWeatherBtn.addEventListener("click", loadWeather);
