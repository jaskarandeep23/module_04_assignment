import { Request, Response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { AuthenticationError } from "../src/api/v1/errors/error";
import { auth } from "../src/config/firebaseConfig";

jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn()
    }
}));

describe("authenticate middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            headers: {}
        };

        res = {
            locals: {}
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    it("should pass AuthenticationError when no token is provided", async () => {
        await authenticate(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );

        const error = next.mock.calls[0][0];
        expect(error.message).toBe("Unauthorized : No token provided");
        expect(error.code).toBe("TOKEN_NOT_FOUND");
    });

    it("should pass AuthenticationError when authorization header is malformed", async () => {
        req.headers = {
            authorization: "InvalidTokenFormat"
        };

        await authenticate(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );

        const error = next.mock.calls[0][0];
        expect(error.message).toBe("Unauthorized : No token provided");
        expect(error.code).toBe("TOKEN_NOT_FOUND");
    });

    it("should pass AuthenticationError when token is invalid", async () => {
        req.headers = {
            authorization: "Bearer wrong-token"
        };

        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("invalid token")
        );

        await authenticate(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );

        const error = next.mock.calls[0][0];
        expect(error.message).toBe("Unauthorized : invalid token");
        expect(error.code).toBe("TOKEN_INVALID");
    });

    it("should set res.locals for manager token", async () => {
        req.headers = {
            authorization: "Bearer manager-token"
        };

        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "manager-uid-002",
            email: "manager@pixell-river.com",
            role: "manager"
        });

        await authenticate(req as Request, res as Response, next);

        expect(res.locals).toEqual({
            uid: "manager-uid-002",
            email: "manager@pixell-river.com",
            role: "manager"
        });

        expect(next).toHaveBeenCalledWith();
    });

    it("should set res.locals for admin token", async () => {
        req.headers = {
            authorization: "Bearer admin-token"
        };

        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "admin-uid-003",
            email: "admin@pixell-river.com",
            role: "admin"
        });

        await authenticate(req as Request, res as Response, next);

        expect(res.locals).toEqual({
            uid: "admin-uid-003",
            email: "admin@pixell-river.com",
            role: "admin"
        });

        expect(next).toHaveBeenCalledWith();
    });
});