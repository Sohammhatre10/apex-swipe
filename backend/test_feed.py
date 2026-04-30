import requests
import uuid

base_url = "http://localhost:8000"
email = f"test_{uuid.uuid4().hex[:8]}@test.com"
pw = "password"

print("Registering:", email)
res = requests.post(f"{base_url}/auth/register", json={
    "email": email,
    "password": pw,
    "name": "Test User",
    "risk_profile": "medium"
})
print(res.status_code, res.text)

print("Logging in...")
res = requests.post(f"{base_url}/auth/login", json={
    "email": email,
    "password": pw
})
print(res.status_code, res.text)
token = res.json().get("access_token")

print("Fetching stocks...")
res = requests.get(f"{base_url}/stocks/feed?limit=20", headers={
    "Authorization": f"Bearer {token}"
})
print(res.status_code, res.text[:200])
