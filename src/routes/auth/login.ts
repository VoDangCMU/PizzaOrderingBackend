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