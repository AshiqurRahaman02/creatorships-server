"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecretKey = process.env.jwt_secret_key;
/**
 * Middleware function to verify the JWT token and attach the user to the request object.
 *
 * @param {Request} req - The request object containing the authorization token in `req.headers`.
 * @param {Response} res - The response object used to send the result.
 * @param {NextFunction} next - The next middleware function to be called if the token is valid.
 * @returns {void} - Calls `next()` if the token is valid and user is found; otherwise, sends a JSON response with an error message.
 */
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[0];
    if (!token) {
        return res
            .status(401)
            .json({ isError: true, message: "No token, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
        const { userId } = decoded;
        console.log(Date());
        // Check if the user exists
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            return res
                .status(401)
                .json({ isError: true, message: "Unauthorized" });
        }
        // Attach the user to the request object
        req.user = user;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ isError: true, message: "Invalid token", err });
    }
});
exports.verifyToken = verifyToken;
