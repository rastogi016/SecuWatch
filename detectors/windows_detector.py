import re
from datetime import datetime
from cti_module.cti_lookup import CTIlookup
from custom_fields.severity import calculate_severity_windows
import hashlib


def get_file_hash(file_path, algo="sha256"):
    try:
        hash_func = getattr(hashlib, algo.lower())()

        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_func.update(chunk)

        return hash_func.hexdigest()
    except Exception as e:
        print(f"[ERROR] Cannot hash {file_path}: {e}")
        return None


cti = CTIlookup()


def parse_windows_log(data):
    try:
        event_id = str(data.get("EventID"))
        account = data.get("AccountName", "-")
        source_ip = data.get("SourceNetworkAddress", "-")
        log_message = data.get("Message", "")
        raw_log = data

        alert_data = None
        ip_cti_data = None
        print(f"[EventIDs] : {event_id}")

        # Enrich if source IP looks valid
        if re.match(r"^(?:\d{1,3}\.){3}\d{1,3}$", source_ip):
            print(f"[CTI] Looking up IP: {source_ip}")
            ip_cti_data = cti.lookup_ip(source_ip)
            print(f"[CTI] IP Data: {ip_cti_data}")

        # === Failed Login Detection (4625) ===
        if event_id == "4625":

            if ip_cti_data and ip_cti_data.get("abuseConfidenceScore", 0) >= 0:
                alert_data = {
                    "alert_type": "Suspicious Failed Login (Malicious IP)",
                    "event_id": event_id,
                    "account": account,
                    "ip": source_ip,
                    "message": log_message,
                    "cti": ip_cti_data,
                    "raw_log": raw_log,
                }
            elif account.lower() not in ["anonymous", "-", "null"]:
                alert_data = {
                    "alert_type": "Failed Login Attempt",
                    "event_id": event_id,
                    "account": account,
                    "ip": source_ip,
                    "message": log_message,
                    "raw_log": raw_log,
                }

        elif event_id == "4688":
            exe_path = data.get("NewProcessName", "")
            cmdline = data.get("CommandLine", "")

            if exe_path:

                file_hash = get_file_hash(exe_path)

                if file_hash:

                    hash_cti = cti.lookup_hash(file_hash)

                    # Proceed only if CTI lookup was successful and contains 'last_analysis_stats'
                    if isinstance(hash_cti, dict) and "last_analysis_stats" in hash_cti:
                        if hash_cti["last_analysis_stats"].get("malicious", 0) > 0:
                            alert_data = {
                                "alert_type": "Malicious Executable Detected",
                                "event_id": event_id,
                                "exe": exe_path,
                                "hash": file_hash,
                                "cmdline": cmdline,
                                "cti": hash_cti,
                                "account": data.get("AccountName", ""),
                                "raw_log": raw_log,
                            }
                    elif "error" in hash_cti:
                        print(f"[INFO] CTI Lookup Error: {hash_cti['error']}")

        # === Privilege Escalation Indicators ===
        elif event_id in [
            "4672",
            "4673",
            "4698",
        ]:  # Special privileges assigned, Svc creation, sensitive token
            alert_data = {
                "alert_type": "Potential Privilege Escalation",
                "event_id": event_id,
                "account": account,
                "ip": source_ip,
                "message": log_message,
                "raw_log": raw_log,
            }
        # === User Account Created (4720) ===
        elif event_id == "4720":
            alert_data = {
                "alert_type": "Suspicious Account Creation",
                "event_id": event_id,
                "account": account,
                "message": log_message,
                "raw_log": raw_log,
            }

        # === User Added to Privileged Group (4728) ===
        elif event_id == "4728":
            alert_data = {
                "alert_type": "Privilege Group Modification",
                "event_id": event_id,
                "account": account,
                "message": log_message,
                "raw_log": raw_log,
            }

        # === Security Log Cleared (1102) ===
        elif event_id == "1102":
            alert_data = {
                "alert_type": "Security Log Cleared",
                "event_id": event_id,
                "account": account,
                "message": log_message,
                "raw_log": raw_log,
            }

        # === Explicit Credential Use (4648) ===
        elif event_id == "4648":
            if ip_cti_data and ip_cti_data.get("abuseConfidenceScore", 0) >= 0:
                alert_data = {
                    "alert_type": "Suspicious Explicit Credential Logon (Malicious IP)",
                    "event_id": event_id,
                    "account": account,
                    "ip": source_ip,
                    "cti": ip_cti_data,
                    "message": log_message,
                    "raw_log": raw_log,
                }
            else:
                alert_data = {
                    "alert_type": "Explicit Credential Use Detected",
                    "event_id": event_id,
                    "account": account,
                    "ip": source_ip,
                    "message": log_message,
                    "raw_log": raw_log,
                }

        # === New Service Installed (4697) ===
        elif event_id == "4697":
            alert_data = {
                "alert_type": "Potential Persistence via New Service",
                "event_id": event_id,
                "account": account,
                "message": log_message,
                "raw_log": raw_log,
            }

        # === Kerberoasting Attempt (4769) ===
        elif event_id == "4769":
            service_name = data.get("ServiceName", "")
            if service_name and "$" not in service_name:  # SPNs without $ often targeted
                alert_data = {
                    "alert_type": "Potential Kerberoasting Detected",
                    "event_id": event_id,
                    "account": account,
                    "service": service_name,
                    "message": log_message,
                    "raw_log": raw_log,
                }

        # === Audit Policy Change (4719) ===
        elif event_id == "4719":
            alert_data = {
                "alert_type": "Audit Policy Change Detected",
                "event_id": event_id,
                "account": account,
                "message": log_message,
                "raw_log": raw_log,
            }

        # If Alert_data generated
        if alert_data:
            alert_data["severity"] = calculate_severity_windows(alert_data)
            return alert_data

    except Exception as e:
        print(f"[ERROR] Failed to parse Windows log: {e}")

    return None
