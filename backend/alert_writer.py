# alert_writer.py

import asyncio
import httpx
from uuid import uuid4
import os
import pathlib
from dotenv import load_dotenv
from config.time_config import get_local_timestamp
from motor.motor_asyncio import AsyncIOMotorClient


async def write_alert(source, alert_data):
    # Add universal fields if not present
    if "source" not in alert_data:
        alert_data["source"] = source
    if "generated_at" not in alert_data:
        alert_data["generated_at"] = get_local_timestamp()
    if "alert_id" not in alert_data:
        alert_data["alert_id"] = str(uuid4())
    if "status" not in alert_data:
        alert_data["status"] = "New"

    # Load .env file from possible fallback locations
    # tried_paths = []

    # # 1. Relative to backend/alert_writer.py
    # path1 = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'db', '.env'))
    # tried_paths.append(path1)
    # load_dotenv(dotenv_path=path1)
    # mongo_uri = os.getenv("MONGODB_URI")

    # # 2. Relative to workspace root - backend/db/.env
    # if not mongo_uri:
    path2 = str(pathlib.Path(__file__).parent.parent / 'backend' / 'db' / '.env')
    # tried_paths.append(path2)
    load_dotenv(dotenv_path=path2)
    mongo_uri = os.getenv("MONGODB_URI")

    # print("Tried .env paths:", tried_paths)
    print("Loaded MONGODB_URI:", mongo_uri)

    if not mongo_uri:
        print("[!] MONGODB_URI not found in environment variables.")
        return

    # Connect to MongoDB and insert alert
    client = None
    try:
        client = AsyncIOMotorClient(mongo_uri)
        db = client["secuwatch"]

        # Choose the collection based on source
        collection = {
            "apache": db["apache_alerts"],
            "windows": db["windows_alerts"],
            "linux": db["linux_alerts"]
        }.get(source)

        if collection is None:
            print(f"[!] Unknown alert source: {source}")
            return

        result = await collection.insert_one(alert_data)
        print(f"[+] Alert written to MongoDB ({source}): {alert_data['alert_id']}")

        # Add MongoDB _id for broadcast
        alert_data["_id"] = str(result.inserted_id)

    except Exception as e:
        print(f"[!] MongoDB insert failed: {e}")
        return

    finally:
        if client:
            client.close()

    # Use detector-generated alert JSON directly, only remove None values
    broadcast_data = {k: v for k, v in alert_data.items() if v is not None}

    # Send alert to local broadcast endpoint
    try:
        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(
                "http://localhost:8000/push_alert", json=broadcast_data
            )
            if response.status_code == 200:
                print("[+] Alert broadcasted")
            else:
                print(f"[!] Broadcast failed: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"[!] HTTP broadcast failed: {e}")
