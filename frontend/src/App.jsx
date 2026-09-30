import Header from './components/Header'
import MapPanel from './components/MapPanel'
import TelemetryFeed from './components/TelemetryFeed'
import LifelineTabs from './components/LifelineTabs'
import useWebSocket from './hooks/useWebSocket'
import { useLocation } from './context/LocationContext'

export default function App() {
  const { location } = useLocation()
  const { telemetry, agentData, connectionStatus, sessionId } = useWebSocket(location.lat, location.lon)

  const alertStatus = agentData?.system_status || 'WARNING - STORM BREWING'
  const isCritical = alertStatus.includes('CRITICAL')

  return (
    <div className="min-h-screen bg-crow-bg text-white flex flex-col">
      <Header alertStatus={alertStatus} isCritical={isCritical} connectionStatus={connectionStatus} />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-[40%] h-[300px] lg:h-auto lg:sticky lg:top-16">
          <MapPanel agentData={agentData} telemetry={telemetry} />
        </div>

        <div className="lg:w-[60%] overflow-y-auto p-4 space-y-4">
          <TelemetryFeed telemetry={telemetry} />
          <LifelineTabs agentData={agentData} />
        </div>
      </main>
    </div>
  )
}
