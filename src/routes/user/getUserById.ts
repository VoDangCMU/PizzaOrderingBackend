import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import {Request, Response} from "express";
import Number from "@root/schemas/Number";


const UserIdSchema = z.object({
	id: Number
})

const UserRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * /user/get-by-id/{id}:
 *   get:
 *     tags: [User]
 *     summary: Retrieve a user by ID
 *     description: Fetches a single user from the database by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Bad request due to invalid user ID.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

export default async function getUserById(req: Request, res: Response) {
	const userId = parseInt(req.params.id, 10);
	let user;

	const parsedId = UserIdSchema.safeParse({id: userId});
	if (parsedId.error) {
		res.BadRequest(parsedId.error);
		return;
	}

	const userIdParsed = parsedId.data.id;

	try {
		user = await UserRepository.findOne({
			where: {id: userIdParsed},
		})
	} catch (e) {
		res.InternalServerError(e)
	}

	if (!user) return res.NotFound("User not found");
	res.Ok(user);
}
