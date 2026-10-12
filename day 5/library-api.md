# Library Books REST API

## 1. Introduction

The Library Books REST API is designed to manage books in a library system. It allows users to retrieve books, view details of a specific book, add new books, update existing books, delete books, and search for books written by a particular author.

### Base URL

`https://api.example.com`

### Book Resource Structure

Each book contains the following fields:

- `id` – A unique identifier for the book.
- `title` – The title of the book.
- `author` – The name of the author.
- `publishedYear` – The year the book was published.

Example book:

```json
{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

---

## 2. API Endpoints

### Endpoint 1: List All Books

- **HTTP Method:** GET
- **Path:** `/books`
- **Description:** Retrieves a list of all books available in the library.
- **Success Status Code:** `200 OK`
- **Request Body:** None required.

**Example Request:**

```http
GET /books
```

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publishedYear": 1958
  },
  {
    "id": 2,
    "title": "The River Between",
    "author": "Ngugi wa Thiong'o",
    "publishedYear": 1965
  }
]
```

### Endpoint 2: Get a Single Book

- **HTTP Method:** GET
- **Path:** `/books/{id}`
- **Description:** Retrieves the details of a specific book using its unique ID.
- **Success Status Code:** `200 OK`
- **Request Body:** None required.

**Example Request:**

```http
GET /books/1
```

**Example Response:**

```json
{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

### Endpoint 3: Create a New Book

- **HTTP Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book record in the library.
- **Success Status Code:** `201 Created`
- **Request Body:** Required.

**Example Request:**

```http
POST /books
Content-Type: application/json
```

**Example Request Body:**

```json
{
  "title": "The River Between",
  "author": "Ngugi wa Thiong'o",
  "publishedYear": 1965
}
```

**Example Response:**

```json
{
  "id": 3,
  "title": "The River Between",
  "author": "Ngugi wa Thiong'o",
  "publishedYear": 1965
}
```

### Endpoint 4: Update an Existing Book

- **HTTP Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Replaces the details of an existing book identified by its ID.
- **Success Status Code:** `200 OK`
- **Request Body:** Required.

**Example Request:**

```http
PUT /books/1
Content-Type: application/json
```

**Example Request Body:**

```json
{
  "title": "Things Fall Apart - Revised Edition",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

**Example Response:**

```json
{
  "id": 1,
  "title": "Things Fall Apart - Revised Edition",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

### Endpoint 5: Delete a Book

- **HTTP Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Deletes a specific book from the library using its ID.
- **Success Status Code:** `204 No Content`
- **Request Body:** None required.

**Example Request:**

```http
DELETE /books/1
```

**Example Response:**

A successful deletion returns `204 No Content` with no response body.

### Endpoint 6: List Books by Author

- **HTTP Method:** GET
- **Path:** `/books?author={authorName}`
- **Description:** Retrieves all books written by a specified author using a query parameter.
- **Success Status Code:** `200 OK`
- **Request Body:** None required.

**Example Request:**

```http
GET /books?author=Chinua%20Achebe
```

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publishedYear": 1958
  }
]
```

---

## 3. Error Responses

The API uses HTTP status codes to indicate whether a request has succeeded or failed.

### Error 400: Bad Request

**Description:** This error occurs when the request contains invalid data or is missing required information.

**Example Scenario:**

A user tries to create a book without providing the required title.

**Example Request Body:**

```json
{
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

**Example Error Response:**

```json
{
  "error": "Bad Request",
  "message": "The book title is required."
}
```

### Error 404: Not Found

**Description:** This error occurs when the requested book does not exist in the library.

**Example Scenario:**

A user requests a book with ID `9999`, but no book with that ID exists.

**Example Request:**

```http
GET /books/9999
```

**Example Error Response:**

```json
{
  "error": "Not Found",
  "message": "The requested book was not found."
}
```

---

## 4. Summary of Endpoints

| No. | HTTP Method | Path                         | Description              | Success Status |
| --- | ----------- | ---------------------------- | ------------------------ | -------------- |
| 1   | GET         | `/books`                     | Retrieve all books       | 200 OK         |
| 2   | GET         | `/books/{id}`                | Retrieve one book        | 200 OK         |
| 3   | POST        | `/books`                     | Create a book            | 201 Created    |
| 4   | PUT         | `/books/{id}`                | Update a book            | 200 OK         |
| 5   | DELETE      | `/books/{id}`                | Delete a book            | 204 No Content |
| 6   | GET         | `/books?author={authorName}` | Retrieve books by author | 200 OK         |

---

## 5. Conclusion

The Library Books REST API provides a simple way to manage library book records. It uses HTTP methods such as GET, POST, PUT, and DELETE to perform different operations on the book resource. The API also uses query parameters to filter books by author and HTTP status codes to communicate successful requests and errors.
