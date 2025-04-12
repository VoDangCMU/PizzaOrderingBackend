import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import {compareSync} from "bcrypt";
import jwt from 'jsonwebtoken';
import env from "@root/env";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import Boolean from "@root/schemas/Boolean";

const UserRepository = AppDataSource.getRepository(Users);

const LoginParamsSchema = z.object({
	username: z.string(),
	password: z.string(),
	keepLogin: Boolean.default(false),
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
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
 *                 description: The username or email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *               keepLogin:
 *                 type: boolean
 *                 description: Whether to keep the user logged in.
 *                 default: false
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export default async function login(req: Request, res: Response) {
	let user;

	logger.debug("Request Body", req.body);

	const parsed = LoginParamsSchema.safeParse(req.body);

	if (parsed.error) {
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const loginParams = parsed.data;

	try {
		user = await UserRepository.findOne({
			where: [
				{username: loginParams.username},
				{email: loginParams.username},
			],
			select: {username: true, password: true, id: true},
		})
	} catch (e) {
		return res.InternalServerError(e)
	}

	if (!user) return res.BadRequest("Username does not exist.");

	logger.debug("Existed user", user);

	if (!compareSync(loginParams.password, user.password)) {
		logger.debug("Password mismatch");
		return res.BadRequest([{message: "Password does not match."}]);
	}

	logger.debug("Password matched");

	const token = jwt.sign({
		username: loginParams.username,
		userID: user.id,
	}, env.JWT_SECRET, {
		algorithm: "HS256",
		expiresIn: "7d",
	})

	logger.debug("Signed token", token);

	res.cookie('token', token, {maxAge: 3600 * 24 * 7});
	return res.Ok(token);
}