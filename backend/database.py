import os
import firebase_admin
from firebase_admin import credentials, firestore
import datetime

# Guard against re-initialization
if not firebase_admin._apps:
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if cred_path and os.path.exists(cred_path):
        try:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            print(f"Failed to initialize Firebase with credentials: {e}")
            # Try initializing without credentials (might use default ADC)
            try:
                firebase_admin.initialize_app()
            except Exception as e2:
                print(f"Failed to initialize Firebase without credentials: {e2}")
    else:
        try:
            firebase_admin.initialize_app()
        except Exception as e:
            print(f"Failed to initialize Firebase default app: {e}")

def save_citizen_state(payload: dict, uuid_str: str) -> bool:
    """
    Saves the payload to Firestore active_users/{uuid}.
    Returns True if successful, False if it failed.
    """
    if not firebase_admin._apps:
        print("Firebase not initialized. Mocking save.")
        return False
        
    try:
        db = firestore.client()
        payload["timestamp"] = datetime.datetime.utcnow().isoformat() + "Z"
        
        # Save to active_users/{uuid}
        db.collection("active_users").document(uuid_str).set(payload)
        
        # Optionally, save to an audit log
        db.collection("audit_logs").add(payload)
        
        return True
    except Exception as e:
        print(f"Failed to write to Firestore: {e}")
        return False
