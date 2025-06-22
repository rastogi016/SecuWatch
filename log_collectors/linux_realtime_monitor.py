import time
import os
from detectors.linux_detector import parse_linux_log
from alert_handler.alert_writer import write_alert


def monitor_linux_logs(log_file):
    print("[*] Starting Linux Log Monitoring...")

    try:
        with open(log_file, "r") as f:
            # Move to End
            f.seek(0, os.SEEK_END)

            while True:
                line = f.readline()
                if not line:
                    time.sleep(0.5)
                    continue

                alert = parse_linux_log(line)

                if alert:
                    write_alert("linux", alert)

    except KeyboardInterrupt:
        print("\n[!] Stopped Linux Log Monitoring.")
    except FileNotFoundError:
        print(f"[!] Log file not found: {log_file}")
    except PermissionError:
        print(f"[!] Permission denied: Try running with sudo to access {log_file}")
