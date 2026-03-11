import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../errors/error";

const validTokens: Record<string, { role: string; email: string }> = {
  "officer-token-abc123": {
    role: "officer",
    email: "officer@pixell-river.com",
  },
  "manager-token-def456": {
    role: "manager",
    email: "manager@pixell-river.com",
  },
  "admin-token-ghi789": {
    role: "admin",
    email: "admin@pixell-river.com",
  },
};

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

    const user = validTokens[token];

    if (!user) {
      return next(
        new AuthenticationError(
          "Unauthorized : invalid token",
          "TOKEN_INVALID"
        )
      );
    }

    res.locals.role = user.role;
    res.locals.email = user.email;
    next();
  } catch (error) {
    next(
      new AuthenticationError(
        "Unauthorized : invalid token",
        "TOKEN_INVALID"
      )
    );
  }
};

export default authenticate;