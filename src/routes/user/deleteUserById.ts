import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import {z} from "zod";
import Number from "@root/schemas/Number";

const UserIdSchema = z.object({
	id: Number
})

const UserRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user by ID
 *     description: Deletes a user from the database by their ID, ensuring the logged-in user can only delete their own account.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User successfully deleted.
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
 *       403:
 *         description: Forbidden, cannot delete another user's account.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
export default async function deleteUserById(req: Request, res: Response) {
	const loggedInUserId = req.userID;
	const _userIdToBeDelete = req.params.id;
	let existedUser;

	const parsedId = UserIdSchema.safeParse({id: _userIdToBeDelete});
	if (parsedId.error) {
		return res.BadRequest(parsedId.error);
	}

	const userIdToBeDelete = parsedId.data.id;
	if (loggedInUserId !== userIdToBeDelete) {
		return res.Forbidden([{message: "Cannot access other's resources."}]);
	}

	try {
		existedUser = await UserRepository.findOne({
			where: {
				id: userIdToBeDelete
			},
		})
	} catch (e) {
		res.InternalServerError(e)
	}

	if (!existedUser) return res.NotFound("User not found");

	await UserRepository.delete(userIdToBeDelete)

	res.Ok(existedUser);
}