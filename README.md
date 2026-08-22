# 🌤️ Weather App

A feature-rich, real-time weather dashboard built with React and Vite. Get accurate forecasts, severe weather alerts, and an immersive visual experience — all powered by the free [Open-Meteo API](https://open-meteo.com/) with **no API key required**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build & Preview](#build--preview)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Weather Alert System](#-weather-alert-system)
- [Configuration](#-configuration)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Weather
- **City Search** — autocomplete search powered by Open-Meteo Geocoding API with instant results
- **Current Conditions** — temperature, feels-like, humidity, wind speed/direction/gusts, pressure, cloud cover, UV index, and visibility
- **Hourly Forecast** — 24-hour scrollable forecast with precipitation probability and temperature
- **7-Day Forecast** — daily highs/lows with visual temperature bars and precipitation chances
- **Sunrise & Sunset** — animated sun arc visualization showing daylight progress
- **Use My Location** — one-click geolocation to fetch weather for your current position

### Visual Experience
- **Dynamic Backgrounds** — animated weather backgrounds that change based on conditions:
  - ☀️ Clear sky with animated sun and rays
  - ⛅ Cloudy with drifting cloud particles
  - 🌧️ Rain with falling raindrop animations
  - ⛈️ Thunderstorm with lightning flash effects
  - ❄️ Snow with falling snowflake particles
  - 🌙 Night with moon and twinkling stars
- **Glassmorphism UI** — frosted glass card design with backdrop blur effects
- **Light & Dark Themes** — toggle between light, dark, and system-preferred themes
- **Smooth Animations** — powered by Framer Motion for fluid transitions

### Weather Intelligence
- **Weather Insights** — contextual tips based on current conditions (UV protection, umbrella reminders, etc.)
- **Health Tips** — health advice based on temperature, humidity, and air quality indicators
- **Weather Mood** — fun mood display based on current weather conditions
- **Weather Icons** — WMO weather code mapping to descriptive labels and emoji icons

### Alert System
- **Real-Time Monitoring** — automatically checks weather conditions every 15 minutes
- **Multi-Point Radar** — monitors a configurable radius (5–50 km) around your location using a 9-point grid
- **Severity Levels** — alerts classified as Watch 🟡, Severe 🟠, or Critical 🔴
- **Alert Categories** — thunderstorm, heavy rain, strong wind, extreme heat, extreme cold
- **Browser Notifications** — native push notifications with quiet hours support
- **Alert Sound** — Web Audio API beep alerts (configurable)
- **Alert History** — log of past alerts stored in localStorage (up to 20 entries)
- **Smart Deduplication** — fingerprint-based dedup prevents duplicate notifications; escalation detection re-notifies when conditions worsen

### User Experience
- **Favorites** — save and quickly switch between frequently viewed cities
- **Temperature Units** — toggle between Celsius and Fahrenheit with automatic data refetch
- **Auto-Refresh** — live data refreshes every 5 minutes in the background
- **Loading States** — skeleton UI placeholders during data fetches
- **Error Handling** — graceful error states with retry functionality
- **Responsive Design** — fully responsive from mobile (380px) to desktop
- **Share Card** — generate a shareable weather summary card

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | React | 19.2 |
| **Build Tool** | Vite | 8.2 |
| **Animations** | Framer Motion | 13.1 |
| **Icons** | React Icons | 5.7 |
| **Linter** | oxlint | 1.75 |
| **Language** | JavaScript (JSX) | ES Modules |
| **Styling** | CSS (custom properties) | — |
| **API** | Open-Meteo (free, no key) | — |
| **Storage** | localStorage | — |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0 or higher
- **npm** v9+, **yarn** v1.22+, or **pnpm** v8+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/weather-app.git
cd weather-app

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server with hot reload
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build & Preview

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

### Linting

```bash
# Run oxlint
npm run lint
```

---

## 📁 Project Structure

```
weather-app/
├── public/                        # Static assets
├── src/
│   ├── main.jsx                   # Application entry point
│   ├── App.jsx                    # Root component — composes entire UI
│   ├── App.css                    # All application styles (glassmorphism, themes, responsive)
│   ├── index.css                  # Global resets and base typography
│   │
│   ├── components/                # UI Components
│   │   ├── Header.jsx             # App header with logo, theme toggle, unit toggle
│   │   ├── SearchBar.jsx          # City search with autocomplete dropdown
│   │   ├── CurrentWeather.jsx     # Main weather display card
│   │   ├── WeatherStats.jsx       # Grid of weather stat cards (wind, UV, pressure, etc.)
│   │   ├── HourlyForecast.jsx     # 24-hour scrollable forecast strip
│   │   ├── DailyForecast.jsx      # 7-day forecast list
│   │   ├── SunriseSunset.jsx      # Sun arc SVG visualization
│   │   ├── FavoriteLocations.jsx  # Saved locations list
│   │   ├── WeatherMood.jsx        # Mood display based on conditions
│   │   ├── WeatherInsights.jsx    # Contextual weather tips
│   │   ├── ShareCard.jsx          # Shareable weather summary
│   │   ├── HealthTips.jsx         # Health advice based on conditions
│   │   ├── WeatherBackground.jsx  # Animated weather particle backgrounds
│   │   ├── WeatherIcon.jsx        # Weather icon renderer
│   │   ├── LoadingSkeleton.jsx    # Skeleton loading placeholders
│   │   ├── ErrorState.jsx         # Error display with retry
│   │   ├── WelcomeState.jsx       # Initial welcome/empty state
│   │   ├── Footer.jsx             # App footer with links and credits
│   │   │
│   │   └── alerts/                # Alert System Components
│   │       ├── index.js           # Barrel export for all alert components
│   │       ├── AlertBanner.jsx    # Top-of-page alert banner
│   │       ├── AlertButton.jsx    # Header alert icon with badge
│   │       ├── AlertCenter.jsx    # Slide-out alert panel (active + history)
│   │       ├── AlertDetail.jsx    # Detailed alert view
│   │       ├── AlertHistory.jsx   # Past alerts list
│   │       ├── AlertSettings.jsx  # Alert configuration panel
│   │       ├── AlertRadar.jsx     # Visual radar showing monitoring area
│   │       ├── AlertToast.jsx     # Toast notification for new alerts
│   │       ├── AlertNotificationPrompt.jsx  # Browser notification permission prompt
│   │       ├── MonitorButton.jsx  # Start/stop monitoring toggle
│   │       └── MonitorStatus.jsx  # Monitoring status indicator
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useWeather.js          # Weather state, search, favorites, auto-refresh, themes
│   │   └── useAlerts.js           # Alert monitoring, notifications, settings, history
│   │
│   ├── services/                  # API & Business Logic
│   │   ├── weatherApi.js          # Open-Meteo API client (geocoding, forecast, parsing)
│   │   └── weatherAlertEngine.js  # Alert detection, multi-point monitoring, deduplication
│   │
│   ├── utils/                     # Utility Functions
│   │   ├── weatherCode.js         # WMO weather code → condition/icon/background mapping
│   │   ├── weatherAlerts.js       # Alert severity evaluation, categories, fingerprints
│   │   ├── formatters.js          # Temperature, time, wind, visibility formatting
│   │   └── distance.js            # Haversine distance, grid point generation
│   │
│   └── assets/                    # Static assets
│       └── hero.png               # Hero image
│
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 🏗️ Architecture

### Data Flow

```
User Action → useWeather hook → weatherApi.js → Open-Meteo API
                ↓
         App.jsx (state) → Components (render)
                ↓
         localStorage (persistence)
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Open-Meteo (free, no key)** | Eliminates API key management; generous rate limits; accurate global data |
| **Single CSS file** | Keeps styling co-located; CSS custom properties handle theming efficiently |
| **Custom hooks for state** | `useWeather` and `useAlerts` encapsulate all logic; components stay pure |
| **localStorage persistence** | Favorites, theme, unit, and alert settings survive page refreshes without a backend |
| **9-point grid monitoring** | Simulates a radar sweep around the user's location for area-wide alert detection |
| **Fingerprint deduplication** | Prevents repeated notifications for the same weather event while still alerting on escalation |

### Alert Engine Flow

```
Timer (15 min) → getMonitoringPoints() → 9 grid points within radius
       ↓
   fetchForecastForPoint() × 9 (parallel)
       ↓
   analyzePoint() × 9 — detect thunderstorm, rain, wind, temp
       ↓
   deduplicateAlerts() — keep highest severity per category
       ↓
   filterBySettings() — respect user's category/severity preferences
       ↓
   shouldNotify() — fingerprint check against recent alerts
       ↓
   sendBrowserNotification() + playAlertSound() + update UI
```

---

## 📡 API Reference

### Open-Meteo Endpoints Used

| Endpoint | Purpose | Rate Limit |
|---|---|---|
| `geocoding-api.open-meteo.com/v1/search` | City name autocomplete | 10,000 req/day |
| `api.open-meteo.com/v1/forecast` | Weather forecast (current + hourly + daily) | 10,000 req/day |

### Weather Data Fields

**Current conditions:** temperature, feels-like, humidity, weather code, wind speed/direction/gusts, pressure, cloud cover, UV index, visibility, day/night

**Hourly (24h):** temperature, weather code, precipitation probability/amount, wind speed/gusts, UV index, visibility, day/night

**Daily (7 days):** weather code, high/low temp, apparent high/low, precipitation sum/probability/hours, max wind/gusts, UV max, sunrise/sunset, daylight duration

---

## 🚨 Weather Alert System

### Severity Levels

| Level | Icon | Description |
|---|---|---|
| **Normal** | 🟢 | No significant weather hazards |
| **Watch** | 🟡 | Conditions may develop; stay aware |
| **Severe** | 🟠 | Significant weather hazard; take precautions |
| **Critical** | 🔴 | Dangerous conditions; take immediate action |

### Alert Categories

| Category | Trigger |
|---|---|
| **Thunderstorm** | WMO codes 95, 96, 99 |
| **Heavy Rain** | WMO codes 63, 65, 67, 81, 82 |
| **Strong Wind** | Wind speed > 30 km/h |
| **Extreme Heat** | Temperature > 37°C |
| **Extreme Cold** | Temperature < 0°C |

### Monitoring Radius

The alert system samples 9 weather forecast points in a grid pattern:
- 1 center point (your location)
- 4 cardinal points at full radius
- 4 diagonal points at ~71% radius

This simulates a radar sweep to detect approaching weather systems from any direction.

### Quiet Hours

During quiet hours (default 11 PM – 6 AM), only **Critical** severity alerts trigger notifications. Watch and Severe alerts are silently logged.

---

## ⚙️ Configuration

### Environment Variables

None required. The app uses only public, free APIs with no authentication.

### User Preferences (localStorage)

| Key | Default | Description |
|---|---|---|
| `weather_favorites` | `[]` | Saved city list |
| `weather_theme` | `"system"` | Theme mode: `light`, `dark`, or `system` |
| `weather_unit` | `"celsius"` | Temperature unit: `celsius` or `fahrenheit` |
| `weather_alert_settings` | See below | Alert monitoring configuration |
| `weather_alert_history` | `[]` | Past alert log (max 20) |
| `weather_monitoring` | `null` | Saved monitoring location for session restore |

### Default Alert Settings

```json
{
  "enabled": false,
  "radius": 10,
  "sound": true,
  "severeOnly": false,
  "quietHoursStart": 23,
  "quietHoursEnd": 6,
  "categories": {
    "thunderstorm": true,
    "heavyRain": true,
    "strongWind": true,
    "extremeHeat": true,
    "extremeCold": true
  }
}
```

---

## 🌐 Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

### Required Browser APIs

- **Geolocation API** — for "Use My Location" and alert monitoring
- **Notifications API** — for browser push notifications (optional)
- **Web Audio API** — for alert sounds (optional)
- **localStorage** — for persisting preferences and alert history
- **CSS Backdrop Filter** — for glassmorphism effects

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "Add my feature"`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style (no semicolons, single quotes, 2-space indent)
- Components go in `src/components/`, alert components in `src/components/alerts/`
- Custom hooks go in `src/hooks/`
- API and business logic go in `src/services/`
- Utility functions go in `src/utils/`
- All styles go in `src/App.css` (single CSS file convention)
- Use CSS custom properties for theming (see `:root` variables in App.css)
- Test your changes across light and dark themes
- Ensure responsive behavior at 380px, 640px, 900px, and 1100px breakpoints

---

## 📝 License

This project is open source. See the repository for license details.

---

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) — free weather API
- [React](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — build tool
- [Framer Motion](https://www.framer.com/motion/) — animation library
- [React Icons](https://react-icons.github.io/react-icons/) — icon library

---

<p align="center">Built with ❤️ using React + Vite</p>
