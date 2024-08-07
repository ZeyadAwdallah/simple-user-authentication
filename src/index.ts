import express from 'express';
import dotenv from 'dotenv';
import { StreamChat } from 'stream-chat';
import { genSaltSync, hashSync } from 'bcrypt';

dotenv.config();

const { PORT, STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const client = StreamChat.getInstance(STREAM_API_KEY!, STREAM_API_SECRET);

const app = express();
app.use(express.json());
const salt = genSaltSync(10);

interface User {
  id: string;
  email: string;
  hashed_password: string;
}

const USERS: User[] = []; // In-memory store for users

// Endpoint to register a new user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required.',
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters.',
    });
  }

  const existingUser = USERS.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists.',
    });
  }

  try {
    const hashed_password = hashSync(password, salt);
    const id = Math.random().toString(36).substr(2, 9); // Generate a random user ID
    const user = {
      id,
      email,
      hashed_password,
    };
    USERS.push(user);

    // Create user in Stream Chat
    await client.upsertUser({
      id,
      email,
      name: email,
    });

    // Create a token for the user
    const token = client.createToken(id);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err: any) {
    return res.json({
      message: err.message,
    });
  }
});

// Endpoint to log in an existing user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);
  const hashed_password = hashSync(password, salt);

  if (!user || user.hashed_password !== hashed_password) {
    return res.status(400).json({
      message: 'Invalid credentials.',
    });
  }

  // Create a token for the user
  const token = client.createToken(user.id);

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
