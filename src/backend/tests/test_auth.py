import json
from app import app

def test_login():
    client = app.test_client()
    response = client.post('/auth/login', json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200 or response.status_code == 401

def test_register():
    client = app.test_client()
    response = client.post('/auth/register', json={
        "email": "newuser@example.com",
        "password": "newpassword"
    })
    assert response.status_code in [201, 409]
