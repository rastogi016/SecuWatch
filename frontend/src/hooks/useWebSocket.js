import { useEffect, useRef } from "react";

export const useAlertWebSocket = (onMessage) => {
  const ws = useRef(null);
  const reconnectInterval = 5000; // 5 seconds

  const resolveWsUrl = () => {
    const envWs = import.meta.env.VITE_WS_URL;
    if (envWs) return envWs;

    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (apiBase) {
      try {
        const url = new URL(apiBase);
        const wsProto = url.protocol === "https:" ? "wss:" : "ws:";
        return `${wsProto}//${url.host}/ws/alerts`;
      } catch {}
    }
    // Local fallback
    return "ws://localhost:8000/ws/alerts";
  };

  const connect = () => {
    const wsUrl = resolveWsUrl();
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      console.log("Raw message from backend:", event.data);
      const alert = JSON.parse(event.data);
      console.log("Parsed alert:", alert);
      onMessage(alert);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected, retrying...");
      setTimeout(connect, reconnectInterval); // Retry
    };
  };

  useEffect(() => {
    connect();
    return () => ws.current && ws.current.close();
  }, [onMessage]);
};

