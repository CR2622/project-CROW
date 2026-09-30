import os
import requests

def dispatch_offline_sms(phone_number: str, critical_route_text: str) -> bool:
    """
    Sends an SMS fallback via Twilio if the main system detects a network drop.
    """
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_phone = os.environ.get("TWILIO_PHONE_NUMBER")

    if not all([account_sid, auth_token, from_phone]):
        print(f"Twilio credentials missing. MOCK SMS to {phone_number}: {critical_route_text}")
        return True

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    
    payload = {
        "To": phone_number,
        "From": from_phone,
        "Body": f"Project CROW Guardian Alert:\n{critical_route_text}"
    }

    try:
        response = requests.post(url, data=payload, auth=(account_sid, auth_token), timeout=5.0)
        response.raise_for_status()
        print(f"SMS successfully dispatched to {phone_number}")
        return True
    except Exception as e:
        print(f"Failed to dispatch SMS: {e}")
        return False
