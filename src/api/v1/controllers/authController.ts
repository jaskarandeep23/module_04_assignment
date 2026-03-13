import { Request, Response } from "express";

const users = [
    {
        email: "officer@pixell-river.com",
        password: "password123",
        idToken: "officer-token-abc123",
        localId: "officer-uid-001",
        role: "officer"
    },
    {
        email: "manager@pixell-river.com",
        password: "password123",
        idToken: "manager-token-def456",
        localId: "manager-uid-002",
        role: "manager"
    },
    {
        email: "admin@pixell-river.com",
        password: "password123",
        idToken: "admin-token-ghi789",
        localId: "admin-uid-003",
        role: "admin"
    }
];

export const signIn = (
    req: Request,
    res: Response
): void => {
    const { email, password } = req.body;

    const user = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        res.status(401).json({
            success: false,
            error: {
                message: "Invalid credentials",
                code: "AUTH_FAILED"
            },
            timestamp: new Date().toISOString()
        });
        return;
    }

    res.status(200).json({
        idToken: user.idToken,
        email: user.email,
        localId: user.localId,
        expiresIn: "3600",
        refreshToken: "mock-refresh-token"
    });
};