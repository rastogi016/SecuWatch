# backend/App.py

import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from backend.auth.routes import router as auth_router
from backend.alerts.routes import router as alerts_router

# --- Environment Setup ---
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), 'db', '.env'))

# --- FastAPI App Initialization ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(alerts_router)

# --- MongoDB Events ---
@app.on_event("startup")
async def startup_db_client():
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        raise RuntimeError("MONGODB_URI not found in environment variables.")
    app.state.mongo_client = AsyncIOMotorClient(mongo_uri)
    app.state.mongo_db = app.state.mongo_client["secuwatch"]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.state.mongo_client.close()

# --- API Endpoints ---
"""
Routes are now provided via routers:
- Auth routes under /auth (backend/auth/routes.py)
- Alerts routes including websocket under /alerts, /push_alert, /ws/alerts (backend/alerts/routes.py)
"""
