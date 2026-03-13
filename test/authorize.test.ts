import { Request, Response } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/error";

describe("authorize middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            params: {}
        };

        res = {
            locals: {}
        };

        next = jest.fn();
    });

    it("should allow access when user has required admin role", () => {
        res.locals = {
            role: "admin"
        };

        const middleware = isAuthorized({ hasRole: ["admin"] });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith();
    });

    it("should allow access when manager role is included", () => {
        res.locals = {
            role: "manager"
        };

        const middleware = isAuthorized({ hasRole: ["admin", "manager"] });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith();
    });

    it("should pass AuthorizationError when role is missing", () => {
        res.locals = {};

        const middleware = isAuthorized({ hasRole: ["admin"] });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(
            expect.any(AuthorizationError)
        );

        const error = next.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: No role found");
        expect(error.code).toBe("ROLE_NOT_FOUND");
    });

    it("should pass AuthorizationError when role is not allowed", () => {
        res.locals = {
            role: "officer"
        };

        const middleware = isAuthorized({ hasRole: ["admin", "manager"] });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(
            expect.any(AuthorizationError)
        );

        const error = next.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: Insufficient role");
        expect(error.code).toBe("INSUFFICIENT_ROLE");
    });

    it("should allow same user when allowSameUser is true", () => {
        req.params = {
            id: "user-123"
        };

        res.locals = {
            uid: "user-123",
            role: "officer"
        };

        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: true
        });

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith();
    });
});