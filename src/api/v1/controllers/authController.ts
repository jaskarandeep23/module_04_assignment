import { Request, Response, NextFunction } from "express";

export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { email, password } = req.body;

    try {
        const apiKey = process.env.FIREBASE_API_KEY;

        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            res.status(401).json({
                success: false,
                error: {
                    message: "Invalid credentials",
                    code: "AUTH_FAILED",
                },
                timestamp: new Date().toISOString(),
            });
            return;
        }

        res.status(200).json({
            idToken: data.idToken,
            email: data.email,
            localId: data.localId,
            expiresIn: data.expiresIn,
            refreshToken: data.refreshToken,
        });
    } catch (error) {
        next(error);
    }
};
