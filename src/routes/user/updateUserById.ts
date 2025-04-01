import {z} from "zod";
import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import bcrypt from "bcrypt";
import Number from "@root/schemas/Number";
import {extractErrorsFromZod} from "@root/utils";
import env from "@root/env";

const UserUpdateSchema = z.object({
	id: Number,
	username: z.string().optional(),
	oldPassword: z.string().optional(),
	newPassword: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email().optional(),
	address: z.string().optional(),
	dateOfBirth: z.union([z.string().transform(Date), z.date()]).optional(),
});

const UserRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * /user/update/:
 *   put:
 *     tags: [User]
 *     summary: Update a user's information
 *     description: Updates the details of a user specified by their ID. The logged-in user can only update their own information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: User successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Bad request due to validation errors.
 *       403:
 *         description: Forbidden, cannot access another user's resources.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

export default async function updateUserById(req: Request, res: Response) {
	const loggedInUserId = req.userID;
	let existedUser;

	const parsedBody = UserUpdateSchema.safeParse(req.body);
	if (parsedBody.error) return res.BadRequest(extractErrorsFromZod(parsedBody.error));
	const newUserData = parsedBody.data!;

	if (loggedInUserId !== newUserData.id) return res.Forbidden([{message: "Cannot access other's resources."}])

	try {
		existedUser = await UserRepository.findOne({
			where: {id: newUserData.id},
			select: {password: true}
		})
	} catch (e) {
		return res.InternalServerError(e)
	}

	if (!existedUser) return res.NotFound([{message: "User not found"}]);

	if (newUserData.newPassword) {
		if (!newUserData.oldPassword) return res.BadRequest([{message: "Old password is required to change password."}]);
		if (!bcrypt.compareSync(newUserData.oldPassword, existedUser.password)) return res.BadRequest([{message: "Old password is incorrect."}]);
		existedUser.password = bcrypt.hashSync(newUserData.newPassword, env.BCRYPT_HASH_ROUND);

		delete newUserData.newPassword;
		delete newUserData.oldPassword;
	}

	Object.assign(existedUser, newUserData);
	await UserRepository.save(existedUser);

	res.Ok(existedUser);
}