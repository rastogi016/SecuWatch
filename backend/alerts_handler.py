import os
import json
from typing import Dict, List

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ALERTS_DIR = os.path.join(BASE_DIR, "alerts")

def update_alert_status(alert_id: str, source: str, new_status: str) -> bool:
    source_dir = os.path.join(ALERTS_DIR, source)
    alert_file = os.path.join(source_dir, alert_id + ".json")

    print(f"[DEBUG] Looking for alert file: {alert_file}")
    print(f"[DEBUG] File exists? {os.path.exists(alert_file)}")
    
    if not os.path.exists(alert_file):
        print(f"[DEBUG] Alert file not found: {alert_file}")
        return False

    if new_status not in {"New", "In Progress", "Resolved"}:
        print(f"[DEBUG] Invalid status: {new_status}")
        return False

    try:
        with open(alert_file, "r") as f:
            alert = json.load(f)

        alert["status"] = new_status

        with open(alert_file, "w") as f:
            json.dump(alert, f, indent=2)

        print(f"[DEBUG] Updated status of {alert_id} to {new_status}")
        return True

    except Exception as e:
        print(f"[DEBUG] Failed to update status for {alert_id}: {e}")
        return False

def get_all_alerts_grouped_by_source() -> Dict[str, List[dict]]:
    grouped_alerts = {"apache": [], "windows": [], "linux": []}

    for source in grouped_alerts.keys():
        source_dir = os.path.join(ALERTS_DIR, source)
        print(f"[DEBUG] Checking: {source_dir}")

        if not os.path.exists(source_dir):
            print(f"[DEBUG] Missing directory: {source_dir}")
            continue

        for filename in os.listdir(source_dir):
            if not filename.endswith(".json"):
                continue

            file_path = os.path.join(source_dir, filename)
            if not os.path.isfile(file_path):
                continue

            try:
                with open(file_path, "r") as f:
                    alert = json.load(f)
                    if "status" not in alert:
                        alert["status"] = "New"

                    grouped_alerts[source].append(alert)
                    print(f"[DEBUG] Loaded {filename} into {source}")
            except Exception as e:
                print(f"[DEBUG] Failed to load {filename}: {e}")

    return grouped_alerts
