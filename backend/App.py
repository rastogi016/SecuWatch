from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from backend.alerts_handler import get_all_alerts_grouped_by_source
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


@app.get("/alerts")
def read_alerts():
    return get_all_alerts_grouped_by_source()


@app.post("/push_alert")
async def push_alert(request: Request):
    alert_data = await request.json()
    await ws_manager.broadcast(alert_data)
    return {"status": "broadcasted"}


@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep connection alive
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
