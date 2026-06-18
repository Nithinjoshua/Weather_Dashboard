# Weather Dashboard

A modern weather dashboard with user authentication, live weather data, forecast view, previous week history, and city search suggestions.

## Project Overview

This repository contains a full-stack weather dashboard application:

- `backend/` - Express server, MongoDB user authentication, weather data APIs
- `frontend/` - React + Vite dashboard UI, authentication pages, charts, and weather cards
- `run.bat` - Windows helper script to launch both backend and frontend servers

## Key Features

- Email/password sign up and login
- Current weather for cities
- Forecast with hourly and multi-day summaries
- Previous week history using archive weather data
- City autocomplete search suggestions
- Dark/light theme toggle
- Responsive UI built with Material UI and Recharts

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Frontend: React, Vite, Material UI, Framer Motion, Lucide Icons, Recharts
- Weather API provider: OpenWeatherMap (live), Open-Meteo archive data (history)

## Repository Structure

- `backend/package.json` - backend dependencies and scripts
- `backend/src/server.js` - backend entry point
- `backend/src/routes/` - auth and weather routes
- `backend/src/controllers/` - route handlers
- `backend/src/services/` - weather provider abstractions and fallback mocks
- `backend/src/models/` - MongoDB user model
- `frontend/package.json` - frontend dependencies and scripts
- `frontend/vite.config.js` - Vite configuration
- `frontend/src/App.jsx` - main dashboard application
- `frontend/src/api/` - frontend API clients
- `frontend/src/components/` - UI component library

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm installed
- MongoDB instance available
- (Optional) OpenWeatherMap API key if you want live weather data

### Backend Setup

1. Open a terminal and navigate to the `backend` folder:

```bash
cd backend
```

2. Install backend dependencies:

```bash
npm install
```

3. Create a `.env` file in `backend/` with the following values:

```env
MONGODB_URI=mongodb://localhost:27017/weather-dashboard
JWT_SECRET=supersecretjwtkey
WEATHER_API_KEY=your_openweather_api_key
FRONTEND_URL=http://localhost:5173
```

- `WEATHER_API_KEY` is optional. Without it, the dashboard will fall back to mock weather data and suggestion data.
- `FRONTEND_URL` is used for CORS configuration.

4. Start the backend server:

```bash
npm start
```

The backend listens on port `5000` by default.

### Frontend Setup

1. Open another terminal and navigate to the `frontend` folder:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend runs on port `5173` by default.

## Run Both Servers on Windows

If you're on Windows, use `run.bat` from the project root:

```bash
run.bat
```

This opens two command windows: one for the backend and one for the frontend.

## API Endpoints

### Health Check

- `GET /api/health`

### Authentication

- `POST /api/auth/signup`
  - Body: `{ name, email, password }`
- `POST /api/auth/login`
  - Body: `{ email, password }`

### Weather Data

- `GET /api/weather/current?city=<city>&units=<metric|imperial>`
- `GET /api/weather/forecast?city=<city>&units=<metric|imperial>`
- `GET /api/weather/history?city=<city>&units=<metric|imperial>`
- `GET /api/weather/search?q=<query>`

## Frontend Behavior

- The app stores authenticated user info and JWT token in `localStorage`
- If no token exists, the login/signup page appears
- Once authenticated, users can search cities, switch units, and view live or fallback weather data

## Notes

- The backend uses OpenWeatherMap for live current weather, forecast, and geocoding suggestions.
- If the weather API key is missing or invalid, the backend returns mock data for current weather and forecast.
- Previous week history is fetched from the Open-Meteo archive API.

## Development Tips

- Change the default search city from `Chennai` in `frontend/src/App.jsx`
- Add additional city suggestions by editing the mock list in `backend/src/services/weather.service.js`
- If you need custom frontend API base URLs, set `VITE_API_URL` in a `.env` file inside `frontend/`

## License

This project does not specify a license. Add one if you want to share or publish it.
