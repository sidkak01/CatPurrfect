# Sprint 4 Backend API Documentation

## **Cat Management API**

### **1. Add Cat**
**Endpoint:** /cat  
**Method:** POST  
**Description:** Adds a new cat to the system.  

#### **Request Body:**
json
{
  "name": "Whiskers",
  "age": 2,
  "breed": "abcd",
  "owner": "sid kak"
}

#### **Response:**
**Success (201 Created)**
json
{
  "message": "Cat added successfully"
}

**Error (400 Bad Request - Missing Fields)**
json
{
  "error": "Name, age, and breed are required"
}

---

### **2. Delete Cat**
**Endpoint:** /cat/:id  
**Method:** DELETE  
**Description:** Deletes a cat by its ID.  

#### **Response:**
**Success (200 OK)**
json
{
  "message": "Cat deleted successfully"
}

**Error (404 Not Found)**
json
{
  "error": "Cat not found"
}

---

### **3. Get All Cats**
**Endpoint:** /cats  
**Method:** GET  
**Description:** Retrieves a list of all cats.

#### **Response:**
**Success (200 OK)**
json
[
  {
    "_id": "987654321",
    "name": "Whiskers",
    "age": 2,
    "breed": "abcd",
    "owner": "sid kak"
  }
]

---

### **4. Get Cat by ID**
**Endpoint:** /cat/:id  
**Method:** GET  
**Description:** Retrieves details of a cat by ID.

#### **Response:**
**Success (200 OK)**
json
{
  "_id": "987654321",
  "name": "Whiskers",
  "age": 2,
  "breed": "abcd",
  "owner": "sid kak"
}

**Error (404 Not Found)**
json
{
  "error": "Cat not found"
}

---

### **5. Update Cat**
**Endpoint:** /cat/:id  
**Method:** PUT  
**Description:** Updates cat information by ID.

#### **Request Body:**
json
{
  "name": "Mittens",
  "age": 3
}

#### **Response:**
**Success (200 OK)**
json
{
  "message": "Cat updated successfully"
}

**Error (404 Not Found)**
json
{
  "error": "Cat not found"
}

---

### **6. Admin Authentication**
**Endpoint:** /admin/login  
**Method:** POST  
**Description:** Authenticates an admin and returns a token.  

#### **Request Body:**
json
{
  "email": "sid@abcd.com",
  "password": "adminpass"
}

#### **Response:**
**Success (200 OK)**
json
{
  "token": "eyJhbGciOiJIUzI1..."
}

**Error (403 Forbidden - Wrong credentials)**
json
{
  "error": "Invalid credentials"
}

**Error (400 Bad Request - Missing Fields)**
json
{
  "error": "Email and password are required"
}

---

#### Run Tests:
navigate to the test folder  
npm install --save-dev jest supertest  
npm test  
