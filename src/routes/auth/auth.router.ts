import {Router} from 'express';
import register from "./register";
import login from "@root/routes/auth/login";

const auth = Router();

auth.post('/login', login)
auth.post('/register', register);

module.exports = auth;