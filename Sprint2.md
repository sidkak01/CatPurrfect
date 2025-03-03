### GitHub link: https://github.com/sidkak01/CatPurrfect
### Video link: https://youtu.be/dDLLxfCmVT4

## Tasks Completed for Sprint 2
- Unit Tests for APIs in backend
- Integration of backend and frontend
- Unit tests for frontend components such as register component and cats component
- Connect backend MongoDB with frontend and start basic integration testing

## Frontend:
### Tasks Accomplished
- Transformed static functionality on frontend to integration with backend
- Register form now connects to MongoDB and adds the user in the database
- Navigation to Cats page upon successfull registration
- Basic authentication for login
- Add logo to home page and navbar
- Add Cats functionality handles form input
- 'Your Cats' updates in real-time when Add Cats form is properly submitted
- Cyprus unit/component tests for register and add cats component
- Configure server-side rendering instead of previously using two separate client and server URLs
- To-Do: Remove storing plaintext password in db (use the cryptography code in backend to hash it)

### Register Component Cyprus Test:
#### This part of the file tests for 4 features: component loading, all fields in the form are present, filling out the form, and clicking the register button
```typescript
  it('Should mount the component', () => {  // basic test for mounting the component
    cy.get('h2').should('contain.text', 'Register');
  });

  it('Should have all form fields', () => {     // ensuring all the form fields are expected
    cy.get('input[name="firstName"]').should('exist');
    cy.get('input[name="lastName"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('Should allow filling out the form', () => {       // test filling out the form
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    cy.get('input[name="firstName"]').should('have.value', 'Test');
    cy.get('input[name="lastName"]').should('have.value', 'User');
    cy.get('input[name="username"]').should('have.value', 'testuser');
    cy.get('input[name="email"]').should('have.value', 'testuser@example.com');
    cy.get('input[name="password"]').should('have.value', 'password123');
    cy.get('input[name="confirmPassword"]').should('have.value', 'password123');
  });

  it('Should allow button to be clicked', () => {   // register button is clickable
    cy.window().then(win => {
      cy.spy(win, 'alert').as('alertSpy');
    });
    
    cy.get('button[type="submit"]').click();
    
    cy.get('@alertSpy').should('be.called');
  });

```
![image](https://github.com/user-attachments/assets/ad850e2e-7dbe-4467-81d8-89f65643ac69)

### Cats Component Cyprus Test:
#### Similarly, this test makes sure the cats component is mounted, has the proper fields, and correctly updates the 'Your Cats' section when submitted
```typescript
  it('Should mount the component', () => {
    cy.get('h3').should('contain.text', 'Add New Cat');
  });

  it('Should have a form with all required fields', () => {     // Make sure all the expected fields are present in the form
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="weight"]').should('exist');
    cy.get('input[name="age"]').should('exist');
    cy.get('select[name="breed"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('Should add a cat when form is submitted', () => {
    cy.get('.text-muted').should('contain.text', 'No cats added yet');
    
    // Fill out the form and then submit
    cy.get('input[name="name"]').type('Whiskers');
    cy.get('input[name="weight"]').type('10 lbs');
    cy.get('input[name="age"]').type('3');
    cy.get('select[name="breed"]').select('Siamese');
    
    cy.get('button[type="submit"]').click();
    
    // Check if the cat was added to the list with correct attributes
    cy.get('.card-title').should('contain.text', 'Whiskers');
    cy.get('.card-text').should('contain.text', 'Breed: Siamese');
    cy.get('.card-text').should('contain.text', 'Age: 3');
    cy.get('.card-text').should('contain.text', 'Weight: 10 lbs');
    
    cy.get('input[name="name"]').should('have.value', '');
  });
```
![image](https://github.com/user-attachments/assets/3843c1f2-16be-4d53-96f9-695875bbf5e8)

## Backend:
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
  "firstName": "Test",
  "lastName": "User",
  "username": "testuser",
  "email": "sidnigade@gmail.com",
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
  "error": "First Name, Last Name, Email, username, and password are required"
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
    "username": "testuser",
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
  "username": "testuser",
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
