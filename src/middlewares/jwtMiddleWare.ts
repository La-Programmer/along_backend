import { expressjwt as jwtMiddleware } from "express-jwt";
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET

const authMiddleware = jwtMiddleware({
    secret: SECRET_KEY!,
    algorithms: ['HS256'],
});

export default authMiddleware;
