🌫️ AirWatch — Real-Time Air Quality Dashboard for India
AirWatch is a real-time air quality monitoring and analytics platform built for Indian cities. It provides live AQI data, pollution history, 24-hour predictions, city comparisons, and AI-generated health advisories — all in one clean, dark-mode interface.
✨ Features

🗺️ Interactive Pollution Map — Visual AQI markers across major Indian cities
📊 48-Hour History Charts — Track how air quality has changed over time
🔮 24-Hour AQI Predictions — Rush hour and weather-aware forecasting
🏙️ City Comparison Tool — Compare pollutant levels across multiple cities side by side
🤖 AI-Powered Insights — Gemini AI analyzes uploaded CSV data and generates actionable insights
💊 Health Advisories — Personalized recommendations based on current AQI levels
📁 CSV Upload & Analysis — Upload your own pollution dataset for instant AI analysis

🛠️ Tech Stack

Frontend: Next.js 15, React, Tailwind CSS
Maps: React Leaflet
AI: Google Gemini API
Charts: Recharts
Deployment: Vercel

🚀 Getting Started
bashgit clone https://github.com/aditya44-tech/AirWatch
cd AirWatch
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

## 🔑 Environment Variables

Create a `.env.local` file in the root:
```
GEMINI_API_KEY=your_gemini_api_key_here
The app works without the API key using rich mock data as fallback.

