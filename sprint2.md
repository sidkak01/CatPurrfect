## Tasks Completed for Sprint 2
- Unit Tests for APIs in backend
- Integration of backend and frontend
## BackEnd:
### Tasks Accomplished
- Developed User Authentication APIs
- Register User API
- Login User API
- Get All Users API
- Get User Count API
- Get User by ID API
- Update User API
- Delete User API
- Executed DB Tests
- Executed Unit Tests for CreateUser API
- Executed Unit Tests for GetAllUsers API

# Sprint 2 Backend API Documentation

## **User Authentication API**

### **1. Register User**
**Endpoint:** `/user`  
**Method:** `POST`  
**Description:** Registers a new user and hashes their password.  

#### **Request Body:**
```json
{
  "email": "sidnigade@gmail.com",
  "username": "sidNigade",
  "password": "password123",
  "role": "user"
}
```

#### **Response:**
**Success (201 Created)**
```json
{
  "message": "User registered successfully"
}
```

**Error (400 Bad Request - Missing Fields)**
```json
{
  "error": "Email, username, and password are required"
}
```

**Error (409 Conflict - Email Already Exists)**
```json
{
  "error": "Email already in use"
}
```

---

### **2. Login User**
**Endpoint:** `/login`  
**Method:** `POST`  
**Description:** Authenticates a user and returns a token.  

#### **Request Body:**
```json
{
  "email": "sidnigade@gmail.com",
  "password": "password123"
}
```

#### **Response:**
**Success (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1..."
}
```

**Error (403 Forbidden - Wrong credentials)**
```json
{
  "error": "Invalid credentials"
}
```

**Error (400 Bad Request - Missing Fields)**
```json
{
  "error": "Email and password are required"
}
```

---

### **3. Get All Users**
**Endpoint:** `/users`  
**Method:** `GET`  
**Description:** Retrieves a list of all users.

#### **Response:**
**Success (200 OK)**
```json
[
  {
    "_id": "123456789",
    "username": "sidnigade",
    "email": "sidnigade@gmail.com",
    "role": "user"
  }
]
```

---

### **4. Get User Count**
**Endpoint:** `/users/count`  
**Method:** `GET`  
**Description:** Retrieves the total count of users in the database.

#### **Response:**
**Success (200 OK)**
```json
{
  "count": 1
}
```

---

### **5. Get User by ID**
**Endpoint:** `/user/:id`  
**Method:** `GET`  
**Description:** Retrieves user details by user ID.

#### **Response:**
**Success (200 OK)**
```json
{
  "_id": "123456789",
  "username": "sidnigade",
  "email": "sidnigade@gmail.com",
  "role": "user"
}
```

**Error (404 Not Found)**
```json
{
  "error": "User not found"
}
```

---

### **6. Update User**
**Endpoint:** `/user/:id`  
**Method:** `PUT`  
**Description:** Updates user information by user ID.

#### **Request Body:**
```json
{
  "username": "updateduser",
  "role": "admin"
}
```

#### **Response:**
**Success (200 OK)**
```json
{
  "message": "User updated successfully"
}
```

**Error (404 Not Found)**
```json
{
  "error": "User not found"
}
```

---

### **7. Delete User**
**Endpoint:** `/user/:id`  
**Method:** `DELETE`  
**Description:** Deletes a user by ID.

#### **Response:**
**Success (200 OK)**
```json
{
  "message": "User account deleted successfully"
}
```

**Error (404 Not Found)**
```json
{
  "error": "User not found"
}
```

---


#### Run Tests:
navigate to the test folder 
npm install --save-dev jest supertest
npm test
