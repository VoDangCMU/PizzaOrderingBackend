import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";

const UserRepository = AppDataSource.getRepository(Users);

/**
 * @swagger
 * /user/get-all:
 *   get:
 *     tags: [User]
 *     summary: Retrieve a list of users
 *     description: Fetches all users from the database.
 *     responses:
 *       200:
 *         description: A list of users successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */

export default async function getAllUsers (req: Request, res: Response) {
    try {
        const users = await UserRepository.find();
        res.Ok(users);
    } catch(error) {
        res.InternalServerError(error);
    }
}