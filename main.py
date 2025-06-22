from log_collectors.apache_collector import collect_apache_logs
from log_collectors.windows_collector import collect_windows_logs
from log_collectors.linux_collector import collect_linux_logs

from log_collectors.apache_realtime_monitor import monitor_apache_logs
from log_collectors.windows_realtime_monitor import monitor_windows_logs
from log_collectors.linux_realtime_monitor import monitor_linux_logs
from additional.banner import bannerSecuWatch


def static_mode():
    print("[*] Static Log Analysis Mode")
    try:
        source = input("Select Source [apache/windows/linux]: ").strip().lower()
        if source == "apache":
            collect_apache_logs("sample_logs/apache_sample.log")
        elif source == "windows":
            collect_windows_logs("sample_logs/windows_sample.evtx")  # if using evtx
        elif source == "linux":
            collect_linux_logs("sample_logs/linux_sample.log")
        else:
            print("[!] Unknown source")
    except KeyboardInterrupt:
        print("\n[!] monitoring stopped by user.")


def realtime_mode():
    print("[*] Real-Time Monitoring Mode")
    try:
        sources = (
            input("Select Sources (comma separated) [apache, windows, linux]: ")
            .lower()
            .split(",")
        )
        for source in sources:
            source = source.strip()
            if source == "apache":
                monitor_apache_logs("sample_logs/apache_sample.log")
            elif source == "windows":
                monitor_windows_logs()
            elif source == "linux":
                monitor_linux_logs("sample_logs/linux_auth.log")
            else:
                print(f"[!] Unknown source: {source}")
    except KeyboardInterrupt:
        print("\n[!] Real-time monitoring stopped by user.")


if __name__ == "__main__":

    bannerSecuWatch()
    try:
        mode = input("Select Mode [static/realtime]: ").strip().lower()
        if mode == "static":
            static_mode()
        elif mode == "realtime":
            realtime_mode()
        else:
            print("[!] Invalid mode")
    except KeyboardInterrupt:
        print("\n[!] Exiting the Tool, SecuWatch[!]")
