import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { UserAttributes } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

const jwtSecretKey: string = process.env.jwt_secret_key!;

// Extend the Request type to include the user property
declare global {
	namespace Express {
		interface Request {
			user?: UserAttributes;
		}
	}
}
/**
 * Middleware function to verify the JWT token and attach the user to the request object.
 *
 * @param {Request} req - The request object containing the authorization token in `req.headers`.
 * @param {Response} res - The response object used to send the result.
 * @param {NextFunction} next - The next middleware function to be called if the token is valid.
 * @returns {void} - Calls `next()` if the token is valid and user is found; otherwise, sends a JSON response with an error message.
 */
export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.header("Authorization")?.split(" ")[0];

	if (!token) {
		return res
			.status(401)
			.json({ isError: true, message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, jwtSecretKey) as JwtPayload;
		const { userId } = decoded;

		console.log(Date());

		// Check if the user exists
		const user = await User.findByPk(userId);

		if (!user) {
			return res
				.status(401)
				.json({ isError: true, message: "Unauthorized" });
		}

		// Attach the user to the request object
		req.user = user;

		next();
	} catch (err) {
		console.log(err);
		res.status(401).json({ isError: true, message: "Invalid token", err });
	}
};
