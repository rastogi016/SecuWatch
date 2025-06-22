import time
from detectors.apache_detector import parse_apache_log
from alert_handler.alert_writer import write_alert

def monitor_apache_logs(file_path):
    print("[*] Real-Time Apache Log Monitoring Started...")
    with open(file_path, "r") as f:
        f.seek(0, 2)  # Move to end of file
        while True:
            line = f.readline()
            if not line:
                time.sleep(0.5)
                continue
            result = parse_apache_log(line)
            if result:
                write_alert("apache", result)