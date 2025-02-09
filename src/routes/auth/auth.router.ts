import {Request, Response, Router} from 'express';

import User from "@root/entity/User";
import {AppDataSource} from "@root/data-source";


const UserRepository = AppDataSource.getRepository(User);
const auth = Router();

auth.post('/login', (req: Request, res: Response) => {

})

auth.post('/register', (req: Request, res: Response) => {
    console.log(req.body);
    UserRepository;
})

module.exports = auth;