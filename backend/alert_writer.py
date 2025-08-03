# alert_writer.py
import asyncio
import httpx
from uuid import uuid4
from config.time_config import get_local_timestamp
from backend.db.collections import get_alert_collection

async def write_alert(source, alert_data):
    alert_id = str(uuid4())
    alert_data.update({
        "source": source,
        "generated_at": get_local_timestamp(),
        "alert_id": alert_id,
        "status": "New"
    })

    collection = get_alert_collection(source)
    if not collection:
        print(f"[!] Unknown alert source: {source}")
        return

    try:
        await collection.insert_one(alert_data)
        print(f"[+] Alert written to MongoDB ({source}): {alert_id}")
    except Exception as e:
        print(f"[!] MongoDB insert failed: {e}")
        return

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post("http://localhost:8000/push_alert", json=alert_data)
            if response.status_code == 200:
                print("[+] Alert broadcasted")
            else:
                print(f"[!] Broadcast failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[!] HTTP broadcast failed: {e}")

