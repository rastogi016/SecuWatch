// import { useEffect } from "react";

// export const useAlertWebSocket = (onMessage) => {
//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8000/ws/alerts");

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         onMessage(data);
//       } catch (err) {
//         console.error("Invalid JSON from WebSocket:", err);
//       }
//     };

//     socket.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     return () => {
//       socket.close();
//     };
//   }, [onMessage]);
// };

import { useEffect, useRef } from "react";

export const useAlertWebSocket = (onMessage) => {
  const ws = useRef(null);
  const reconnectInterval = 5000; // 5 seconds

  const connect = () => {
    ws.current = new WebSocket("ws://localhost:8000/ws/alerts");

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      console.log("📩 Raw message from backend:", event.data);
      const alert = JSON.parse(event.data);
      console.log("📦 Parsed alert:", alert);
      onMessage(alert);
    };

    ws.current.onerror = (error) => {
      console.error("⚠️ WebSocket error", error);
    };

    ws.current.onclose = () => {
      console.log("❌ WebSocket disconnected, retrying...");
      setTimeout(connect, reconnectInterval); // Retry
    };
  };

  useEffect(() => {
    connect();
    return () => ws.current && ws.current.close();
  }, [onMessage]);
};

