import re 
from datetime import datetime
from cti_module.cti_lookup import CTIlookup
from custom_fields.severity import calculate_severity_apache

cti = CTIlookup()

def parse_apache_log(log_line):
    pattern = r'(?P<ip>\S+) \S+ \S+ \[(?P<date>.*?)\] "(?P<method>\S+) (?P<path>\S+) \S+" (?P<status>\d{3})'
    match = re.search(pattern, log_line)

    if not match:
        return None

    data = match.groupdict()
    status = int(data['status'])
    alert_type = None

    # Detection logic
    suspicious_paths = ["/admin", "/phpmyadmin", "/wp-login.php", "/.git", "/etc/passwd", "/login"]
    suspicious_status = [403, 404]

    if status == 401:
        alert_type = "Unauthorized Access Attempt"
    elif data['path'].lower() in suspicious_paths and status in suspicious_status:
        alert_type = "Admin Access Attempt"
    elif any(kw in data['path'].lower() for kw in ['select', 'union', 'drop', 'insert']):
        alert_type = "SQL Injection Attempt"

    # CTI enrichment
    ip_info = cti.lookup_ip(data['ip'])
    full_url = data['path']

    if not (data['path'].startswith("http://") or data['path'].startswith("https://")):
        # Looks like a full URL
        full_url = f"http://{data['ip']}{data['path']}"

    url_info = cti.lookup_url(full_url)

    # Decide if alert should be raised (even if detection logic doesn't fire)
    is_ip_flagged = isinstance(ip_info, dict) and ip_info.get("abuseConfidenceScore", 0) > 10
    is_url_flagged = isinstance(url_info, dict) and ( url_info.get("malicious", 0) > 0 or url_info.get("suspicious", 0) > 0)

    if alert_type or is_ip_flagged or is_url_flagged:
        alert_data = {
            "alert_type": alert_type or "CTI Flagged IP/URL",
            "ip": data['ip'],
            "path": data['path'],
            "method": data['method'],
            "status_code": status,
            "raw_log": log_line.strip(),
            "cti": {
                "ip_lookup": ip_info,
                "url_lookup": url_info
            }
        }
        alert_data["severity"] = calculate_severity_apache(alert_data)
        return alert_data

    return None