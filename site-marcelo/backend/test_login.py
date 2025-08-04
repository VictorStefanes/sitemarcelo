import requests
import json

# Teste do endpoint de login
url = "http://127.0.0.1:5001/auth/login"
data = {
    "username": "admin",
    "senha": "admin123"
}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Erro: {e}")
