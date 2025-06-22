from datetime import datetime, timezone
import pytz

# Default UTC timestamp format
DEFAULT_TIME_FORMAT = "%Y-%m-%dT%H:%M:%SZ"


def get_current_utc_timestamp(format_str=DEFAULT_TIME_FORMAT) -> str:
    """Return the current UTC timestamp in the given format."""
    return datetime.now(timezone.utc).strftime(format_str)


def get_iso_timestamp() -> str:
    """Return current UTC time in ISO 8601 format (with timezone info)."""
    return datetime.now(timezone.utc).isoformat()


def get_local_timestamp(tz_name="Asia/Kolkata", format_str="%Y-%m-%d %H:%M:%S") -> str:
    """
    Return current local time in the given timezone and format.
    Default timezone: Asia/Kolkata (IST)
    """
    local_tz = pytz.timezone(tz_name)
    return datetime.now(local_tz).strftime(format_str)
