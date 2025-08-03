#backedn/App.py
import os
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
from motor.motor_asyncio import AsyncIOMotorClient
from backend.alerts_handler import get_all_alerts_grouped_by_source, update_alert_status
from backend.ws_instance import ws_manager
from backend.auth.routes import router as auth_router

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), 'db', '.env'))
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# --- MongoDB Startup Event ---
@app.on_event("startup")
async def startup_db_client():
    mongo_uri = os.getenv("MONGODB_URI")
    app.state.mongo_client = AsyncIOMotorClient(mongo_uri)
    app.state.mongo_db = app.state.mongo_client["secuwatch"]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.state.mongo_client.close()

# --- Models ---
class AlertModel(BaseModel):
    source: Literal["apache", "windows", "linux"]
    alert_id: str
    generated_at: str
    status: Literal["New", "In Progress", "Resolved"]
    # add other fields like message, ip, etc. as needed

class StatusUpdateRequest(BaseModel):
    status: Literal["New", "In Progress", "Resolved"]

# --- Routes ---
@app.get("/alerts")
async def read_alerts():
    try:
        return await get_all_alerts_grouped_by_source(app)
    except Exception as e:
        print(f"Error in /alerts GET: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/push_alert")
async def push_alert(alert: AlertModel):
    try:
        await ws_manager.broadcast(alert.dict())
        return {"status": "broadcasted"}
    except Exception as e:
        print(f"Error in /push_alert POST: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await ws_manager.connect(websocket)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"Error in /ws/alerts WEBSOCKET: {type(e).__name__}: {e}")

@app.patch("/alerts/{source}/{alert_id}/status")
async def change_alert_status(source: str, alert_id: str, req: StatusUpdateRequest):
    try:
        print(f"PATCH /alerts/{source}/{alert_id}/status called with status: {req.status}")
        print(f"Source: {source}, Alert ID: {alert_id}")
        if req.status not in ["New", "In Progress", "Resolved"]:
            print("Invalid status received.")
            raise HTTPException(status_code=400, detail="Invalid status")

        success = await update_alert_status(alert_id, source, req.status, app)
        print(f"Update result: {success}")
        if not success:
            print("Alert not found or update failed.")
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

    return {"message": f"Status updated to {req.status}"}

