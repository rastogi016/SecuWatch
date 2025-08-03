from typing import Dict, List
from fastapi import FastAPI
from bson import ObjectId


VALID_STATUSES = {"New", "In Progress", "Resolved"}

def get_alert_collection(app: FastAPI, source: str):
    try:
        db = app.state.mongo_db
        collection = {
            "apache": db["apache_alerts"],
            "windows": db["windows_alerts"],
            "linux": db["linux_alerts"]
        }.get(source)
        if collection is None:
            raise ValueError(f"Unknown source: {source}")
        return collection
    except Exception as e:
        print(f"Error in get_alert_collection: {type(e).__name__}: {e}")
        return None

def serialize_doc(doc):
    try:
        doc = dict(doc)
        if '_id' in doc and isinstance(doc['_id'], ObjectId):
            doc['_id'] = str(doc['_id'])
        return doc
    except Exception as e:
        print(f"Error in serialize_doc: {type(e).__name__}: {e}")
        return {}

async def update_alert_status(alert_id: str, source: str, new_status: str, app: FastAPI) -> bool:
    try:
        if new_status not in VALID_STATUSES:
            print(f"Invalid status: {new_status}")
            return False
        collection = get_alert_collection(app, source)
        if collection is None:
            print(f"Collection not found for source: {source}")
            return False
        result = await collection.update_one(
            {"alert_id": alert_id},
            {"$set": {"status": new_status}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error in update_alert_status: {type(e).__name__}: {e}")
        return False

async def get_all_alerts_grouped_by_source(app: FastAPI) -> Dict[str, List[dict]]:
    try:
        return {
            "apache": [serialize_doc(doc) for doc in await get_alert_collection(app, "apache").find().to_list(1000)],
            "windows": [serialize_doc(doc) for doc in await get_alert_collection(app, "windows").find().to_list(1000)],
            "linux": [serialize_doc(doc) for doc in await get_alert_collection(app, "linux").find().to_list(1000)]
        }
    except Exception as e:
        print(f"Error in get_all_alerts_grouped_by_source: {type(e).__name__}: {e}")
        return {"apache": [], "windows": [], "linux": []}
