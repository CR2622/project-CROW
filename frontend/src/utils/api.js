const API_BASE = '/api/v1'

export async function simulateOutage(phoneNumber = '') {
  try {
    const res = await fetch(`${API_BASE}/simulate-outage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber }),
    })
    return await res.json()
  } catch (err) {
    console.error('Simulate outage failed:', err)
    return { sms_dispatched: false, error: err.message, system_degraded: true }
  }
}

export async function runAnalysis(lat = 17.6868, lon = 83.2185, userId = 'demo_citizen') {
  try {
    const res = await fetch(`${API_BASE}/crow-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon, user_id: userId }),
    })
    return await res.json()
  } catch (err) {
    console.error('Analysis failed:', err)
    return { system_degraded: true, error: err.message }
  }
}
