import csv
import os
from alert_handler.alert_writer import write_alert

def collect_windows_logs(file_path):

    if not os.path.exists(file_path):
        print(f"[!] File not found: {file_path}")
        return
    
    with open(file_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            event_id = row.get("EventID", "").strip()
            print(f"[DEBUG] EventID: {event_id}") 

            if event_id == "4625":  # Failed logon
                alert = {
                    "alert_type": "Failed Login Attempt",
                    "event_id": event_id,
                    "account": row.get("AccountName", "").strip(),
                    "workstation": row.get("WorkstationName", "").strip(),
                    "ip": row.get("SourceNetworkAddress", "").strip(),
                    "message": row.get("Message", "").strip(),
                    "logon_type": row.get("LogonType", "").strip(),
                    "raw_log": {k: v.strip() if isinstance(v, str) else v for k, v in row.items()},
                }
                write_alert("windows", alert)