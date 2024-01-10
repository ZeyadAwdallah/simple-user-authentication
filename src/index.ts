import express from "express";
import dotenv from "dotenv";
import { genSaltSync, hashSync } from "bcrypt"
import { StreamChat } from "stream-chat"

dotenv.config();

const { PORT, STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const client = StreamChat.getInstance(STREAM_API_KEY!, STREAM_API_SECRET);


const app = express();

app.use(express.json());
const salt = genSaltSync(10)

interface User {
    id: string;
    email: string;
    hashed_passwoed: string;
};

const USERS: User[] = [];

app.post('/register', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "eamil and password are required." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "password must ba atleast 6 Char." });
    }

    const existingUser = USERS.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "user already exists." });
    }

    try {
        const hashed_passwoed: string = hashSync(password, salt)
        const id: string = Math.random().toString(36).slice(2)
        const user = {
            id, email, hashed_passwoed
        }
        USERS.push(user)

        await client.upsertUser(
            {
                id,
                email,
                name: email,
            }
        )
        const token = client.createToken(id)
        return res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
            }
        })

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', (req, res) => {
    const {email,password}=req.body
    const user = USERS.find((user)=>user.email===email)
    const hashed_passwoed =hashSync(password,salt)

    if(!user||user.hashed_passwoed!==hashed_passwoed){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }

    const token = client.createToken(user.id)
    return res.status(200).json({
        token,
        user: {
            id: user.id,
            email: user.email,
        }
    })
 });

app.listen(PORT, () => {
    console.log("aaaaaaaaaaaah", PORT)
});
