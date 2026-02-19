# P2-Challenge-1 (Server Side)

# API Documentation

## Base URL

http://localhost:3000

---

## Endpoints

### Auth

- POST /login
- POST /register

### Categories

- GET /categories
- POST /categories
- PUT /categories/:id

### Lawyers (Protected)

- POST /lawyers
- GET /lawyers
- GET /lawyers/:id
- PUT /lawyers/:id
- DELETE /lawyers/:id

### Public

- GET /pub/lawyers
- GET /pub/lawyers/:id
- GET /pub/categories

---

## 1. POST /login

Description:
Login user dan menghasilkan access token

Request Body:
{
"email": "string",
"password": "string"
}

Response (200):
{
"access_token": "string"
}

---

## 2. POST /register

Description:
Register user baru

Body:
{
"username": "string",
"email": "string",
"password": "string",
"phoneNumber": "string",
"address": "string"
}

Response (201):
{
"message": "User created"
}

---

## 3. GET /categories

Headers:
{
"access_token": "string"
}

Response:
{
"data": []
}

---

## 4. POST /categories

Headers:
{
"access_token": "string"
}

Body:
{
"name": "string"
}

Response:
{
"message": "Category created"
}

---

## 5. PUT /categories/:id

Headers:
{
"access_token": "string"
}

Body:
{
"name": "string"
}

Response:
{
"message": "Category updated"
}

---

## 6. POST /lawyers

Headers:
{
"access_token": "string"
}

Body:
{
"name": "string",
"specialist": "string",
"experience": "number",
"fee": "number"
}

Response:
{
"message": "Lawyer created"
}

---

## 7. GET /lawyers

Headers:
{
"access_token": "string"
}

Response:
{
"data": []
}

---

## 8. GET /lawyers/:id

Headers:
{
"access_token": "string"
}

Response:
{
"data": {}
}

---

## 9. PUT /lawyers/:id

Headers:
{
"access_token": "string"
}

Body:
{
"name": "string",
"specialist": "string",
"experience": "number",
"fee": "number"
}

Response:
{
"message": "Lawyer updated"
}

---

## 10. DELETE /lawyers/:id

Headers:
{
"access_token": "string"
}

Response:
{
"message": "Lawyer deleted"
}

---

## 11. GET /pub/lawyers

Description:
Mengambil list lawyer untuk public site

Response:
{
"data": []
}

---

## 12. GET /pub/lawyers/:id

Description:
Mengambil detail lawyer

Response:
{
"data": {}
}

---

## 13. GET /pub/categories

Description:
Mengambil semua kategori

Response:
{
"data": []
}

---

## Global Errors

401 Unauthorized:
{
"message": "Invalid token"
}

403 Forbidden:
{
"message": "You dont have any access"
}

500 Internal Server Error:
{
"message": "Internal server error"
}
