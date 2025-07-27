from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.alerts_handler import get_all_alerts_grouped_by_source, update_alert_status
from backend.ws_instance import ws_manager
from backend.auth import models
from backend.db import engine
from backend.auth.routes import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)
app.include_router(auth_router)

# Existing route: GET all alerts
@app.get("/alerts")
def read_alerts():
    return get_all_alerts_grouped_by_source()

# Broadcast alert over WebSocket
@app.post("/push_alert")
async def push_alert(request: Request):
    alert_data = await request.json()
    await ws_manager.broadcast(alert_data)
    return {"status": "broadcasted"}

# WebSocket endpoint for real-time alerts
@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep connection alive
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# New: PATCH route to update alert status
class StatusUpdateRequest(BaseModel):
    status: str

@app.patch("/alerts/{source}/{alert_id}/status")
def change_alert_status(source: str, alert_id: str, req: StatusUpdateRequest):
    if req.status not in ["New", "In Progress", "Resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    success = update_alert_status(alert_id, source, req.status)

    if not success:
        raise HTTPException(status_code=404, detail="Alert not found or update failed")

    return {"message": f"Status updated to {req.status}"}
