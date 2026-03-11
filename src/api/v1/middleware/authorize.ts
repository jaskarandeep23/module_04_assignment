import { Request, Response, NextFunction } from "express";
import { AuthorizationOptions } from "../models/authorizationoption";
import { AuthorizationError } from "../errors/error";

const isAuthorized = (opts: AuthorizationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { role, uid } = res.locals;
      const { id } = req.params;

      if (opts.allowSameUser && id && uid === id) {
        return next();
      }

      if (!role) {
        throw new AuthorizationError(
          "Forbidden: No role found",
          "ROLE_NOT_FOUND"
        );
      }

      if (opts.hasRole.includes(role)) {
        return next();
      }

      throw new AuthorizationError(
        "Forbidden: Insufficient role",
        "INSUFFICIENT_ROLE"
      );
    } catch (error) {
      next(error);
    }
  };
};

export default isAuthorized;