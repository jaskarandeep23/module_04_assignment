import { Request, Response, NextFunction } from "express";
import { successResponse } from "../models/responsemodel";
import { auth } from "../../../config/firebaseConfig";
import { UserRecord } from "firebase-admin/auth";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    const id = req.params.id as string;

    try {

        const user: UserRecord = await auth.getUser(id);

        res
        .status(HTTP_STATUS.OK)
        .json(successResponse(user));

    } catch (error) {
        next(error);
    }

};