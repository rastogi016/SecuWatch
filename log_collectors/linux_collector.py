import re
from datetime import datetime
from alert_handler.alert_writer import write_alert

def collect_linux_logs(log_file_path):
    with open(log_file_path, 'r') as file:
        for line in file:
            result = parse_linux_log(line)
            if result:
                write_alert('linux', result)

def parse_linux_log(log_line):
    # Example: Detect Failed SSH login
    if "Failed password" in log_line:
        pattern = r'Failed password for (invalid user )?(?P<username>\w+) from (?P<ip>[\d.]+)'
        match = re.search(pattern, log_line)
        if match:
            username = match.group("username")
            ip = match.group("ip")
            return {
                "alert_type": "Failed SSH Login",
                "username": username,
                "ip": ip,
                "message": "Failed SSH login attempt detected",
                "raw_log": log_line.strip(),
                "source": "linux",
                "generated_at": datetime.utcnow().isoformat()
            }
    # Detect successful root login
    if "Accepted password for root" in log_line:
        pattern = r'Accepted password for root from (?P<ip>[\d.]+)'
        match = re.search(pattern, log_line)
        if match:
            ip = match.group("ip")
            return {
                "alert_type": "Root SSH Login",
                "username": "root",
                "ip": ip,
                "message": "Successful root SSH login",
                "raw_log": log_line.strip(),
                "source": "linux",
                "generated_at": datetime.utcnow().isoformat()
            }

    return None