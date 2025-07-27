import json
import os
import asyncio
import requests
from datetime import datetime
from uuid import uuid4
from config.time_config import (
    get_current_utc_timestamp,
    get_iso_timestamp,
    get_local_timestamp,
)
# Import only if running the backend WebSocket server
def write_alert(source, alert_data):
    # Ensure alerts/source directory exists
    alert_dir = os.path.join("alerts", source)
    os.makedirs(alert_dir, exist_ok=True)


    # Add metadata
    alert_id= str(uuid4())
    alert_data.update(
        {
            "source": source,
            "generated_at": get_local_timestamp(),
            "alert_id": alert_id,
            "status": "New",
        }
    )

    # Create alert file with alert_id
    filename = os.path.join(alert_dir, f"{alert_id}.json")

    # Save the alert
    with open(filename, "w") as f:
        json.dump(alert_data, f, indent=4)

    print(f"[+] Alert Written: {filename}")

    # New broadcast via HTTP
    try:
        response = requests.post("http://localhost:8000/push_alert", json=alert_data)
        if response.status_code == 200:
            print("[+] Alert broadcasted ")
        else:
            print(f"[!] Broadcast failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[!] HTTP broadcast failed: {e}")
