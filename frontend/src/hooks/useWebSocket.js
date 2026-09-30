import { useState, useEffect, useRef } from 'react';

export default function useWebSocket(lat = 17.6868, lon = 83.2185) {
  const [telemetry, setTelemetry] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [sessionId, setSessionId] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    let reconnectAttempts = 0;
    const maxAttempts = 5;
    let reconnectTimeout = null;
    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;
      setConnectionStatus('connecting');
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/v1/ws/dynamic-evac`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttempts = 0;
        // Send initial location config to backend
        ws.send(JSON.stringify({ lat, lon }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'telemetry') {
            setTelemetry(data.data || data);
          } else if (data.type === 'agent_update') {
            setAgentData(data.data || data);
          } else if (data.type === 'session_init') {
            setSessionId(data.session_id);
          }
        } catch (error) {
          console.error('Error parsing WS message:', error);
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setConnectionStatus('disconnected');
        if (reconnectAttempts < maxAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectAttempts++;
          reconnectTimeout = setTimeout(connect, timeout);
        } else {
          setConnectionStatus('error');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [lat, lon]); // Re-connect when location changes

  return { telemetry, agentData, connectionStatus, sessionId };
}
