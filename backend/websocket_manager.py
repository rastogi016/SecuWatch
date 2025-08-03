# websocket_manager.py
from fastapi import WebSocket
from typing import List

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("[WS] Client connected")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print("[WS] Client disconnected")

    async def broadcast(self, message: dict):
        print(f"[WS] Broadcasting to {len(self.active_connections)} clients")
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"[WS] Broadcast error: {e}")
                self.disconnect(connection)
