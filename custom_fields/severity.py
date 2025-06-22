
"""
Calculates severity score based on alert type and CTI enrichment.
Parameters:
    alert_data (dict): Dictionary containing at least 'alert_type' and optional 'cti' 
Returns:
    int: Severity score (1–10)
"""

threats = {
    # Apache
    "Unauthorized Access Attempt": 5,
    "Admin Access Attempt": 6,
    "SQL Injection Attempt": 9,
    "CTI Flagged IP/URL": 7,
    "Multiple Indicators": 10,

    # Linux
    "Failed SSH Login": 4,
    "Successful SSH Login": 3,
    "Root SSH Login": 8,
    "Suspicious IP Activity": 6,

    # Windows
    "Failed Login Attempt": 5,
    "Suspicious Failed Login (Malicious IP)": 7,
    "Malicious Executable Detected": 9,
    "Potential Privilege Escalation": 8,
}

def severity_level(score):
    if score < 4:
        return "low"
    elif score < 6:
        return "medium"
    elif score < 8:
        return "high"
    return "critical"

def calculate_severity_apache(alert_data):
    base_score = threats.get(alert_data.get("alert_type"), 3)

    cti = alert_data.get("cti", {})
    ip_info = cti.get("ip_lookup", {})
    url_info = cti.get("url_lookup", {})

    ip_score = ip_info.get("abuseConfidenceScore", 0)
    url_malicious = url_info.get("malicious", 0)
    url_suspicious = url_info.get("suspicious", 0)

    # Increase severity based on CTI scores
    if ip_score > 25:
        base_score += 1
    if url_malicious > 0:
        base_score += 2
    elif url_suspicious > 0:
        base_score += 1

    severity = severity_level(min(base_score, 10))
    return severity

def calculate_severity_linux(alert_data):
    base_score = threats.get(alert_data.get("alert_type"), 3)

    cti = alert_data.get("cti", {})
    ip_info = cti.get("ip_lookup", {})
    ip_score = ip_info.get("abuseConfidenceScore", 0)

    # Boost severity for highly suspicious IPs
    if ip_score > 25:
        base_score += 1
    if ip_score > 50:
        base_score += 1

    severity = severity_level(min(base_score, 10))
    return severity

def calculate_severity_windows(alert_data):
    base_score = threats.get(alert_data.get("alert_type"), 3)

    cti = alert_data.get("cti", {})

    # IP-based scoring
    if isinstance(cti, dict):
        if "abuseConfidenceScore" in cti:
            score = cti.get("abuseConfidenceScore", 0)
            if score > 25:
                base_score += 1
            if score > 50:
                base_score += 1

        # Hash-based CTI (VirusTotal-like structure)
        elif "last_analysis_stats" in cti:
            analysis = cti.get("last_analysis_stats", {})
            if analysis.get("malicious", 0) > 0:
                base_score += 2
            elif analysis.get("suspicious", 0) > 0:
                base_score += 1

    severity = severity_level(min(base_score, 10))
    return severity
