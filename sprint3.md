Backend:
Tasks Accomplished
Developed Cat Management APIs

Create Cat API

Get All Cats API

Get Cat Count API

Get Cat by ID API

Update Cat API

Delete Cat API

Executed DB Tests

Executed Unit Tests for CreateCat API

Executed Unit Tests for GetAllCats API

Sprint 3 Backend API Documentation
Cat Management API
1. Create Cat
Endpoint: /api/cat
Method: POST
Description: Adds a new cat to the database.

Request Body:
json
Copy
Edit
{
  "name": "Fluffy",
  "weight": 4,
  "age": 2,
  "breed": "Bengal"
}
Response:
Success (201 Created)

json
Copy
Edit
{
  "_id": "123456789",
  "name": "Fluffy",
  "weight": 4,
  "age": 2,
  "breed": "Bengal"
}
Error (400 Bad Request - Missing Fields)

json
Copy
Edit
{
  "error": "Name, weight, and age are required"
}
2. Get All Cats
Endpoint: /api/cats
Method: GET
Description: Retrieves a list of all cats.

Response:
Success (200 OK)

json
Copy
Edit
[
  {
    "_id": "123456789",
    "name": "Fluffy",
    "weight": 4,
    "age": 2,
    "breed": "Bengal"
  }
]
3. Get Cat Count
Endpoint: /api/cats/count
Method: GET
Description: Retrieves the total count of cats in the database.

Response:
Success (200 OK)

json
Copy
Edit
{
  "count": 10
}
4. Get Cat by ID
Endpoint: /api/cat/:id
Method: GET
Description: Retrieves cat details by cat ID.

Response:
Success (200 OK)

json
Copy
Edit
{
  "_id": "123456789",
  "name": "Fluffy",
  "weight": 4,
  "age": 2,
  "breed": "Bengal"
}
Error (404 Not Found)

json
Copy
Edit
{
  "error": "Cat not found"
}
5. Update Cat
Endpoint: /api/cat/:id
Method: PUT
Description: Updates cat information by cat ID.

Request Body:
json
Copy
Edit
{
  "name": "Updated Fluffy",
  "weight": 5
}
Response:
Success (200 OK)

json
Copy
Edit
{
  "message": "Cat updated successfully"
}
Error (404 Not Found)

json
Copy
Edit
{
  "error": "Cat not found"
}
6. Delete Cat
Endpoint: /api/cat/:id
Method: DELETE
Description: Deletes a cat by ID.

Response:
Success (200 OK)

json
Copy
Edit
{
  "message": "Cat deleted successfully"
}
Error (404 Not Found)

json
Copy
Edit
{
  "error": "Cat not found"
}
Run Tests:
Navigate to the test folder

bash
Copy
Edit
npm install --save-dev jest supertest  
npm test  
