import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LocationProvider } from './context/LocationContext'
import { PhoneProvider } from './context/PhoneContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocationProvider>
      <PhoneProvider>
        <App />
      </PhoneProvider>
    </LocationProvider>
  </React.StrictMode>
)
