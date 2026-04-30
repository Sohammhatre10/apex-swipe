import requests

try:
    res = requests.post("http://localhost:8000/auth/login", json={"email": "test@test.com", "password": "password"})
    print("Status:", res.status_code)
    print("Response:", res.json())
except Exception as e:
    print("Exception:", e)
