import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # One level up from backend/
ALERTS_DIR = os.path.join(BASE_DIR, "alerts")


def get_all_alerts_grouped_by_source():
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
                    grouped_alerts[source].append(alert)
                    print(f"[DEBUG] Loaded {filename} into {source}")
            except Exception as e:
                print(f"[DEBUG] Failed to load {filename}: {e}")

    return grouped_alerts
