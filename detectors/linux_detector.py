import re
from datetime import datetime
from cti_module.cti_lookup import CTIlookup
from custom_fields.severity import calculate_severity_linux

cti = CTIlookup()


def parse_linux_log(log_line):
    # Patterns for SSH logs
    failed_pattern = r"Failed password for (?P<user>\S+) from (?P<ip>\d+\.\d+\.\d+\.\d+) port (?P<port>\d+)"
    accepted_pattern = r"Accepted password for (?P<user>\S+) from (?P<ip>\d+\.\d+\.\d+\.\d+) port (?P<port>\d+)"

    alert = None
    match = None
    alert_type = None

    if "Failed password" in log_line:
        match = re.search(failed_pattern, log_line)
        if match:
            alert_type = "Failed SSH Login"

    elif "Accepted password" in log_line:
        match = re.search(accepted_pattern, log_line)
        if match:
            user = match.group("user")
            if user == "root":
                alert_type = "Root SSH Login"
            else:
                alert_type = "Successful SSH Login"

    if match:
        data = match.groupdict()
        ip = data["ip"]
        user = data["user"]
        port = data["port"]

        # Run CTI lookup on the IP
        try:
            ip_cti = cti.lookup_ip(ip)

        except Exception as e:
            print(f"[CTI Lookup Failed] {e}")
            ip_cti = {}

        # Decide if we want to flag this as a malicious IP
        ip_suspicious = (
            isinstance(ip_cti, dict) and ip_cti.get("abuseConfidenceScore", 0) > 50
        )

        if alert_type or ip_suspicious:
            alert_data = {
                "alert_type": alert_type or "Suspicious IP Activity",
                "ip": ip,
                "user": user,
                "port": port,
                "raw_log": log_line.strip(),
                "cti": {"ip_lookup": ip_cti},
            }
            alert_data["severity"] = calculate_severity_linux(alert_data)
            return alert_data

    return None
