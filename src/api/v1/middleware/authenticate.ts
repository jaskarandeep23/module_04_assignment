import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { AuthenticationError } from "../errors/error";
import { auth } from "../../../config/firebaseConfig";

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        const token: string | undefined = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;

        if (!token) {
            return next(
                new AuthenticationError(
                    "Unauthorized : No token provided",
                    "TOKEN_NOT_FOUND"
                )
            );
        }

        const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);

        res.locals.uid = decodedToken.uid;
        res.locals.email = decodedToken.email;
        res.locals.role = decodedToken.role;

        next();
    } catch (error: unknown) {
        next(
            new AuthenticationError(
                "Unauthorized : invalid token",
                "TOKEN_INVALID"
            )
        );
    }
};

export default authenticate;