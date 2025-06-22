import base64
import requests
from .config import ABUSEIPDB_API_KEY, VIRUSTOTAL_API_KEY


class CTIlookup:
    def __init__(self):
        self.api_key = ABUSEIPDB_API_KEY
        self.base_url = "https://api.abuseipdb.com/api/v2/check"

    # To be implemented using AbuseIPDB

    def lookup_ip(self, ip):
        headers = {"Key": self.api_key, "Accept": "application/json"}
        params = {"ipAddress": ip, "maxAgeInDays": 90}  # Check last 90 Days

        response = requests.get(self.base_url, headers=headers, params=params)

        if response.status_code == 200:
            data = response.json()["data"]
            return {
                "ip": data["ipAddress"],
                "isPublic": data["isPublic"],
                "abuseConfidenceScore": data["abuseConfidenceScore"],
                "country": data["countryCode"],
                "totalReports": data["totalReports"],
                "domain": data["domain"],
                "lastReportedAt": data["lastReportedAt"],
            }
        else:
            return {"error": f"Failed to check IP: {response.status_code}"}

    # To be implemented using Virustotal
    def lookup_hash(self, file_hash):
        url = f"https://www.virustotal.com/api/v3/files/{file_hash}"

        headers = {"x-apikey": VIRUSTOTAL_API_KEY}

        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code == 200:
            attributes = response.json()["data"]["attributes"]
            return {
                "type": attributes.get("type", "unknown"),
                "sha256": attributes.get("sha256"),
                "md5": attributes.get("md5"),
                "last_analysis_stats": attributes.get("last_analysis_stats", {}),
                "reputation": attributes.get("reputation", 0),
                "magic": attributes.get("magic", "Unknown"),
            }

        elif response.status_code == 404:
            return {"error": "Hash not found on VirusTotal"}
        else:
            return {"error": f"Failed to check hash: {response.status_code}"}

    def lookup_url(self, url_to_check):

        encoded_url = (
            base64.urlsafe_b64encode(url_to_check.encode()).decode().strip("=")
        )
        url = f"https://www.virustotal.com/api/v3/urls/{encoded_url}"

        headers = {"x-apikey": VIRUSTOTAL_API_KEY}

        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()["data"]["attributes"]
            return {
                "last_analysis_stats": data.get("last_analysis_stats"),
                "categories": data.get("categories"),
                "reputation": data.get("reputation"),
                "harmless": data.get("last_analysis_stats", {}).get("harmless"),
                "malicious": data.get("last_analysis_stats", {}).get("malicious"),
                "suspicious": data.get("last_analysis_stats", {}).get("suspicious"),
            }
        if response.status_code == 404:
            return {"error": "URL not found"}

        return {"error": f"Failed to check URL: {response.status_code}"}
