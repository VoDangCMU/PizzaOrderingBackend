import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import {Request, Response} from "express";
import Number from "@root/schemas/Number";


const UserIdSchema = z.object({
	id: Number
})

const UserRepository = AppDataSource.getRepository(User);

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
