import re
from cti_module.cti_lookup import CTIlookup
from custom_fields.severity import calculate_severity_linux

cti = CTIlookup()

def parse_linux_log(log_line):
    alert_data = {}

    # === SSH Brute Force & Root Login ===
    failed_pattern = r"Failed password for (?P<user>\S+) from (?P<ip>\d+\.\d+\.\d+\.\d+) port (?P<port>\d+)"
    accepted_pattern = r"Accepted password for (?P<user>\S+) from (?P<ip>\d+\.\d+\.\d+\.\d+) port (?P<port>\d+)"

    if "Failed password" in log_line:
        match = re.search(failed_pattern, log_line)
        if match:
            data = match.groupdict()
            ip = data["ip"]
            user = data["user"]
            port = data["port"]

            try:
                ip_cti = cti.lookup_ip(ip)
            except Exception as e:
                print(f"[CTI Lookup Failed] {e}")
                ip_cti = {}

            ip_suspicious = (
                isinstance(ip_cti, dict) and ip_cti.get("abuseConfidenceScore", 0) > 50
            )

            alert_data = {
                "alert_type": "Failed SSH Login",
                "ip": ip,
                "user": user,
                "port": port,
                "raw_log": log_line.strip(),
                "cti": {"ip_lookup": ip_cti},
            }

            if ip_suspicious:
                alert_data["alert_type"] = "Failed SSH Login from Malicious IP"

    elif "Accepted password" in log_line:
        match = re.search(accepted_pattern, log_line)
        if match:
            data = match.groupdict()
            ip = data["ip"]
            user = data["user"]
            port = data["port"]

            try:
                ip_cti = cti.lookup_ip(ip)
            except Exception as e:
                print(f"[CTI Lookup Failed] {e}")
                ip_cti = {}

            ip_suspicious = (
                isinstance(ip_cti, dict) and ip_cti.get("abuseConfidenceScore", 0) > 50
            )

            alert_type = "Successful SSH Login"
            if user == "root":
                alert_type = "Root SSH Login"

            if ip_suspicious:
                alert_type += " from Malicious IP"

            alert_data = {
                "alert_type": alert_type,
                "ip": ip,
                "user": user,
                "port": port,
                "raw_log": log_line.strip(),
                "cti": {"ip_lookup": ip_cti},
            }

    # === Sudo Abuse ===
    elif "sudo:" in log_line:
        sudo_pattern = r"sudo: (?P<user>\S+) : .*COMMAND=(?P<command>.+)"
        match = re.search(sudo_pattern, log_line)
        if match:
            data = match.groupdict()
            alert_data = {
                "alert_type": "Potential Sudo Abuse",
                "user": data["user"],
                "command": data["command"].strip(),
                "raw_log": log_line.strip(),
                "cti": {},
            }

    # === Cron Job ===
    elif "CRON" in log_line and "CMD" in log_line:
        cron_pattern = r"CRON\[\d+\]: \((?P<user>.+)\) CMD \((?P<cmd>.+)\)"
        match = re.search(cron_pattern, log_line)
        if match:
            data = match.groupdict()
            alert_data = {
                "alert_type": "Suspicious Cron Job Creation",
                "user": data["user"],
                "command": data["cmd"],
                "raw_log": log_line.strip(),
                "cti": {},
            }

    # === Kernel Module ===
    elif "kernel:" in log_line and ("module loaded" in log_line or "insmod" in log_line):
        alert_data = {
            "alert_type": "Kernel Module Loaded (Potential Rootkit)",
            "raw_log": log_line.strip(),
            "cti": {},
        }

    # === Log Tampering ===
    elif "history -c" in log_line or "rm /var/log" in log_line:
        alert_data = {
            "alert_type": "Potential Log Tampering Detected",
            "raw_log": log_line.strip(),
            "cti": {},
        }

    # === Final Return (Single Return Point) ===
    if alert_data:
        alert_data["severity"] = calculate_severity_linux(alert_data)
        return alert_data

    return None
