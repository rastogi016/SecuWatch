#backend/db/collections.py

def get_users_collection(app):
    return app.state.mongo_db["users"]

def get_alert_collection(app, source: str):
    return {
        "apache": app.state.mongo_db["apache_alerts"],
        "windows": app.state.mongo_db["windows_alerts"],
        "linux": app.state.mongo_db["linux_alerts"]
    }.get(source)
