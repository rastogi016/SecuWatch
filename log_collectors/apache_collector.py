from detectors.apache_detector import parse_apache_log
from backend.alert_writer import write_alert


def collect_apache_logs(file_path):
    with open(file_path, "r") as f:
        for line in f:
            result = parse_apache_log(line)
            if result:
                write_alert("apache", result)
