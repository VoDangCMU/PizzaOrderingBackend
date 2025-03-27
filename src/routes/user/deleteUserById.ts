import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import {z} from "zod";
import Number from "@root/schemas/Number";

const UserIdSchema = z.object({
	id: Number
})

const UserRepository = AppDataSource.getRepository(User);

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