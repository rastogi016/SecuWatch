
import time
import win32evtlog
from detectors.windows_detector import parse_windows_log
from alert_handler.alert_writer import write_alert

def monitor_windows_logs():
    print("[*] Starting Windows Log Monitoring...")

    server = 'localhost'
    log_type = 'Security'
    hand = win32evtlog.OpenEventLog(server, log_type)

    # Step 1: Get the latest RecordNumber (newest event)
    flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
    events = win32evtlog.ReadEventLog(hand, flags, 0)
    last_record_id = 0
    if events:
        last_record_id = events[0].RecordNumber

    # Step 2: Monitor forward from that point
    flags = win32evtlog.EVENTLOG_FORWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ

    while True:
        events = win32evtlog.ReadEventLog(hand, flags, 0)
        if events:
            for event in events:
                if event.RecordNumber <= last_record_id:
                    continue  # Skip old logs

                last_record_id = event.RecordNumber  # Update latest seen

                event_id = str(event.EventID & 0xFFFF)
                string_data = event.StringInserts if event.StringInserts else []

                data = {
                    "Date": event.TimeGenerated.Format(),
                    "Time": event.TimeGenerated.Format(),
                    "EventID": event_id,
                    "Message": string_data[0] if string_data else "",
                    "raw_event": string_data
                }

                if event_id == "4688":
                    data["NewProcessName"] = string_data[5] if len(string_data) > 5 else ""
                    data["CommandLine"] = string_data[8] if len(string_data) > 8 else ""
                    data["AccountName"] = string_data[1] if len(string_data) > 1 else ""

                elif event_id == "4625":
                    data["AccountName"] = string_data[5] if len(string_data) > 5 else ""
                    data["LogonType"] = string_data[8] if len(string_data) > 8 else ""
                    data["WorkstationName"] = string_data[11] if len(string_data) > 11 else ""
                    data["SourceNetworkAddress"] = string_data[18] if len(string_data) > 18 else ""

                # Now pass this dynamic log to the parser
                alert = parse_windows_log(data)
                if alert:
                    write_alert("windows", alert)

        time.sleep(5)  # Poll every 5 seconds
