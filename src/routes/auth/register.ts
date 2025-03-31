import {Request, Response} from "express";
import Users from "@root/entity/Users";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import env from "@root/env";
import bcrypt from "bcrypt";

const RegisterParamsSchema = z.object({
	username: z.string(),
	password: z.string(),
	dateOfBirth: z.union([z.string().transform(Date), z.date()]),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string(),
	email: z.string().email(),
	address: z.string(),
})

const UserRepository = AppDataSource.getRepository(Users);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details. Validates input and checks for existing usernames or emails.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               address:
 *                 type: string
 *                 example: "123 Main St, Anytown, USA"
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: johndoe@example.com
 *                 phone:
 *                   type: string
 *                   example: "+1234567890"
 *                 address:
 *                   type: string
 *                   example: "123 Main St, Anytown, USA"
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 role:
 *                   type: string
 *                   example: user
 *                 password:
 *                   type: string
 *                   example: ""
 *       '400':
 *         description: Bad Request (validation error or user already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username or Email already exists"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
export default async function register(req: Request, res: Response) {
	let existedUser, createdUser;

	logger.debug("Request Body", req.body);

	const parsed = RegisterParamsSchema.safeParse(req.body);

	if (parsed.error) {
		logger.warn(parsed.error);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const userData = parsed.data;

	try {
		existedUser = await UserRepository.findOne({
			where: [
				{email: userData.email},
				{username: userData.username},
			]
		})
	} catch (e) {
		return res.InternalServerError(e)
	}

	if (existedUser) {
		logger.debug("Existed User", existedUser);
		res.BadRequest("Username or Email already exists");
		return;
	}

	logger.debug("Creating new user");

	const user = new Users();

	Object.assign(user, userData);
	user.role = "user";
	user.password = bcrypt.hashSync(user.password, env.BCRYPT_HASH_ROUND);

	try {
		createdUser = await UserRepository.save(user);
	} catch (e) {
		return res.InternalServerError(e)
	}

	logger.debug("Created user", createdUser);

	// HIDE PASSWORD BEFORE SEND BACK TO CLIENT
	// Or you can re query user from database, but that not cost-efficient
	createdUser.password = "";

	return res.Ok(createdUser);
}