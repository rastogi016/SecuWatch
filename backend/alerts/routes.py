from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Request
from typing import Literal
from pydantic import BaseModel

from backend.alerts_handler import get_all_alerts_grouped_by_source, update_alert_status
from backend.ws_instance import ws_manager

router = APIRouter(tags=["alerts"])

class AlertModel(BaseModel):
    source: Literal["apache", "windows", "linux"]
    alert_id: str
    generated_at: str
    status: Literal["New", "In Progress", "Resolved"]
    ip: str | None = None
    method: str | None = None
    path: str | None = None
    status_code: int | None = None
    severity: str | None = None
    alert_type: str | None = None
    raw_log: str | None = None
    cti: dict | None = None
    _id: str | None = None

class StatusUpdateRequest(BaseModel):
    status: Literal["New", "In Progress", "Resolved"]

@router.get("/alerts")
async def read_alerts(request: Request):
    try:
        return await get_all_alerts_grouped_by_source(request.app)
    except Exception as e:
        print(f"Error in /alerts GET: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@router.post("/push_alert")
async def push_alert(alert: AlertModel):
    try:
        await ws_manager.broadcast(alert.dict())
        return {"status": "broadcasted"}
    except Exception as e:
        print(f"Error in /push_alert POST: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@router.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await ws_manager.connect(websocket)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"Error in /ws/alerts WEBSOCKET: {type(e).__name__}: {e}")

@router.patch("/alerts/{source}/{alert_id}/status")
async def change_alert_status(source: str, alert_id: str, req: StatusUpdateRequest, request: Request):
    try:
        if req.status not in ["New", "In Progress", "Resolved"]:
            raise HTTPException(status_code=400, detail="Invalid status")

        success = await update_alert_status(alert_id, source, req.status, request.app)
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found or update failed")

        await ws_manager.broadcast({
            "type": "status_update",
            "id": alert_id,
            "source": source,
            "status": req.status
        })
        return {"message": f"Status updated to {req.status}"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in PATCH /alerts/{source}/{alert_id}/status: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
