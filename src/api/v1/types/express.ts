import {Request, Response, NextFunction} from "express";

export type MiddleWareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;
