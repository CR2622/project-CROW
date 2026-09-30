import os
import getpass

env_file = ".env"
keys_to_ask = [
    "GOOGLE_MAPS_API_KEY",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
    "DEMO_PHONE_NUMBER"
]

print("\n🦅 === Project CROW Secure Key Setup ===")
print("Your typing will be hidden for security.")
print("Press Enter to skip any key and keep its current/mock value.\n")

# Read existing env
env_data = {}
keys_order = []
if os.path.exists(env_file):
    with open(env_file, "r") as f:
        for line in f:
            if "=" in line:
                k, v = line.strip().split("=", 1)
                env_data[k] = v
                keys_order.append(k)

# Ask for keys
for key in keys_to_ask:
    val = getpass.getpass(prompt=f"{key}: ")
    if val.strip():
        env_data[key] = val.strip()
        if key not in keys_order:
            keys_order.append(key)

# Hardcode the service account file name if they skipped it
if "GOOGLE_APPLICATION_CREDENTIALS" not in env_data or not env_data["GOOGLE_APPLICATION_CREDENTIALS"]:
    env_data["GOOGLE_APPLICATION_CREDENTIALS"] = "crow-service-account.json"
    if "GOOGLE_APPLICATION_CREDENTIALS" not in keys_order:
        keys_order.append("GOOGLE_APPLICATION_CREDENTIALS")

# Write back
with open(env_file, "w") as f:
    for k in keys_order:
        f.write(f"{k}={env_data[k]}\n")

print("\n✅ Keys securely saved to .env!")
print("Restarting your backend server is recommended to apply changes.")
