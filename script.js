// ===== এলিমেন্ট =====
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

// ===== আবহাওয়ার কোড (WMO) =====
const WEATHER_CODES = {
  0: "পরিষ্কার আকাশ",
  1: "প্রায় পরিষ্কার",
  2: "আংশিক মেঘলা",
  3: "মেঘলা",
  45: "কুয়াশা",
  48: "ঘন কুয়াশা",
  51: "হালকা গুঁড়ি বৃষ্টি",
  53: "গুঁড়ি বৃষ্টি",
  55: "ঘন গুঁড়ি বৃষ্টি",
  61: "হালকা বৃষ্টি",
  63: "মাঝারি বৃষ্টি",
  65: "ভারী বৃষ্টি",
  71: "হালকা তুষারপাত",
  73: "তুষারপাত",
  75: "ভারী তুষারপাত",
  80: "বৃষ্টির ঝাপটা",
  81: "মাঝারি ঝাপটা",
  82: "প্রবল ঝাপটা",
  95: "বজ্রঝড়",
  96: "শিলাসহ বজ্রঝড়",
};

const DAY_NAMES = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];

// ===== আইকন =====
function makeIcon(code) {
  const uid = "g" + Math.random().toString(36).slice(2, 8);
  const S = `${uid}s`, C = `${uid}c`;

  const defs = `<defs>
      <radialGradient id="${S}" cx="35%" cy="35%">
        <stop offset="0%" stop-color="#ffe89a"/><stop offset="100%" stop-color="#f7c948"/>
      </radialGradient>
      <linearGradient id="${C}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#dfe3f7"/>
      </linearGradient>
    </defs>`;

  const cloud = `<path d="M26 62c-7 0-12-5-12-11s5-11 12-11c2-8 9-13 17-13 10 0 18 7 19 17 6 1 10 6 10 12 0 7-6 12-13 12z" fill="url(#${C})"/>`;

  if (code === 0 || code === 1) {
    return `<svg class="icon" viewBox="0 0 100 100">${defs}
      <circle cx="50" cy="48" r="22" fill="url(#${S})"/>
      ${[0,45,90,135,180,225,270,315].map(a =>
        `<rect x="48" y="12" width="4" height="10" rx="2" fill="#f7c948" transform="rotate(${a} 50 48)"/>`
      ).join("")}
    </svg>`;
  }
  if (code === 2) {
    return `<svg class="icon" viewBox="0 0 100 100">${defs}
      <circle cx="63" cy="34" r="16" fill="url(#${S})"/>${cloud}</svg>`;
  }
  if (code >= 71 && code <= 75) {
    return `<svg class="icon" viewBox="0 0 100 100">${defs}${cloud}
      ${[34,50,66].map(x => `<circle cx="${x}" cy="78" r="3.5" fill="#cfe3ff"/>`).join("")}
    </svg>`;
  }
  if (code >= 95) {
    return `<svg class="icon" viewBox="0 0 100 100">${defs}${cloud}
      <path d="M52 68 L42 84 h8 l-4 12 14-18 h-8 l4-10z" fill="#f7c948"/></svg>`;
  }
  if (code >= 51 && code <= 82) {
    return `<svg class="icon" viewBox="0 0 100 100">${defs}${cloud}
      ${[32,48,64].map(x =>
        `<path d="M${x} 70 l-3 12" stroke="#8ab4f8" stroke-width="4" stroke-linecap="round"/>`
      ).join("")}
    </svg>`;
  }
  return `<svg class="icon" viewBox="0 0 100 100">${defs}${cloud}</svg>`;
}

// ===== সহায়ক =====
function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function renderForecast(daily) {
  const cards = daily.time.map((dateString, i) => {
    const day = i === 0 ? "আজ" : DAY_NAMES[new Date(dateString).getDay()];
    return `
      <div class="day">
        <span class="day-name">${day}</span>
        <div class="day-icon">${makeIcon(daily.weather_code[i])}</div>
        <span class="day-high">${Math.round(daily.temperature_2m_max[i])}°</span>
        <span class="day-low">${Math.round(daily.temperature_2m_min[i])}°</span>
      </div>`;
  });
  document.getElementById("forecast").innerHTML = cards.join("");
}

// ===== API =====
async function findCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("শহর খোঁজা যায়নি");

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("এই নামে কোনো শহর পাওয়া যায়নি");
  }
  return data.results[0];
}

async function getWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`
    + `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
    + `&daily=temperature_2m_max,temperature_2m_min,weather_code`
    + `&timezone=auto&forecast_days=7`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("আবহাওয়ার তথ্য আনা যায়নি");

  return await response.json();   // পুরো data, শুধু current নয়
}

// ===== পেজে দেখানো =====
async function showWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    setStatus("শহরের নাম লিখুন", true);
    return;
  }

  searchBtn.disabled = true;
  setStatus("খোঁজা হচ্ছে...");
  resultEl.classList.add("hidden");

  try {
    const place = await findCity(city);
    const data = await getWeather(place.latitude, place.longitude);
    const weather = data.current;

    document.getElementById("place").textContent = `${place.name}, ${place.country}`;
    document.getElementById("time").textContent =
      new Date(weather.time).toLocaleString("bn-BD",
        { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
    document.getElementById("temp").innerHTML =
      `${Math.round(weather.temperature_2m)}<sup>°</sup>`;
    document.getElementById("iconSlot").innerHTML = makeIcon(weather.weather_code);
    document.getElementById("desc").textContent =
      WEATHER_CODES[weather.weather_code] || "অজানা";
    document.getElementById("feels").textContent =
      `${Math.round(weather.apparent_temperature)}°`;
    document.getElementById("humidity").textContent = `${weather.relative_humidity_2m}%`;
    document.getElementById("wind").textContent = `${Math.round(weather.wind_speed_10m)} km/h`;

    renderForecast(data.daily);

    resultEl.classList.remove("hidden");
    setStatus("");
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    searchBtn.disabled = false;
  }
}

// ===== ঘটনা =====
searchBtn.addEventListener("click", showWeather);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") showWeather();
});

showWeather();