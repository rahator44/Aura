import requests
import time
import json
import random

BASE_URL = "http://127.0.0.1:8000/api"

def run_test():
    email = f"hacker_{random.randint(1000, 9999)}@example.com"
    password = "password123"
    
    print(f"[*] Registering new user: {email}...")
    reg_res = requests.post(f"{BASE_URL}/register", json={
        "name": "Hacker User",
        "email": email,
        "password": password,
        "password_confirmation": password
    })
    
    if reg_res.status_code != 201:
        print("Registration failed:", reg_res.text)
        return

    print("[*] Logging in...")
    login_res = requests.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password
    })
    
    if login_res.status_code != 200:
        print("Login failed:", login_res.text)
        return
        
    token = login_res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json", "Accept": "application/json"}
    print(f"[*] Login successful. Token received.")
    
    print("[*] Fetching events...")
    events_res = requests.get(f"{BASE_URL}/events", headers=headers)
    events = events_res.json().get("events", {}).get("data", [])
    if not events:
        print("No events found to book.")
        # Fallback to ID 1
        event_id = 1
    else:
        event_id = events[0]["id"]
        
    print(f"[*] Found event ID {event_id}. Starting rapid booking attack (Spamming 150 requests)...")
    
    for i in range(1, 151):
        # We simulate viewing the event and then booking it
        # Viewing an event is logged in AURA++ if we hit a specific endpoint, but let's just spam booking
        print(f"  -> Attempt {i}: Booking ticket...")
        book_res = requests.post(f"{BASE_URL}/bookings", json={
            "event_id": event_id,
            "quantity": 1, "transaction_id": "DUMMY_TRX_123"
        }, headers=headers)
        
        if book_res.status_code == 401:
            print(f"\n[!!!] SUCCESS: Zero Trust blocked the user on attempt {i}!")
            print("[!!!] The JWT token was revoked and the account was suspended.")
            break
        elif book_res.status_code != 201:
            print(f"  [X] Failed: {book_res.status_code} - {book_res.text}")
        else:
            print(f"  [+] Booked successfully.")
            
        time.sleep(0.1) # Rapid fire

if __name__ == "__main__":
    run_test()
