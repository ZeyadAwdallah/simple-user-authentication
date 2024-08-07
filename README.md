
# **User Authentication API with Stream Chat**

## **Overview**

This is an Express.js application that provides user registration and login functionalities. It integrates with the Stream Chat API to create and manage users. Passwords are hashed using bcrypt for secure storage, and users are authenticated using tokens created by Stream Chat.

## **Features**

- **User Registration**: Allows new users to register with an email and password.
- **User Login**: Authenticates existing users and provides an authentication token.
- **Password Security**: Passwords are hashed using bcrypt before being stored.

## **Dependencies**

- `express`: Web framework for Node.js.
- `dotenv`: Loads environment variables from a `.env` file.
- `stream-chat`: Stream Chat client library.
- `bcrypt`: Library for hashing passwords.

## **Setup**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/stream-chat-user-authentication.git
   cd stream-chat-user-authentication
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` File**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=3000
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

## **Endpoints**

### **POST /register**

Registers a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Responses:**

- **200 OK**

  ```json
  {
    "token": "stream_chat_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
  ```

- **400 Bad Request**

  ```json
  {
    "message": "Error message"
  }
  ```

### **POST /login**

Authenticates an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Responses:**

- **200 OK**

  ```json
  {
    "token": "stream_chat_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
  ```

- **400 Bad Request**

  ```json
  {
    "message": "Error message"
  }
  ```
