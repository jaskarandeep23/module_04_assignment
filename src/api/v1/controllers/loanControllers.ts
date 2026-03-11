import { Request, Response, NextFunction } from "express";
import { Loan } from "../models/loanModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responsemodel";
import { ServiceError } from "../errors/error";

let loans: Loan[] = [
    {
        id: 1,
        applicant: "John Smith",
        amount: 50000,
        status: "under_review",
        createdAt: "2025-01-10T10:00:00.000Z"
    },
    {
        id: 3,
        applicant: "Michael Chen",
        amount: 500000,
        status: "pending",
        createdAt: "2025-01-05T10:00:00.000Z"
    },
    {
        id: 4,
        applicant: "Emily Williams",
        amount: 1000000,
        status: "flagged",
        createdAt: "2025-01-03T10:00:00.000Z"
    }
];

export const getLoans = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        res.status(HTTP_STATUS.OK).json({
            message: "loan applications retrieved",
            count: loans.length,
            data: loans
        });

    } catch (error) {
        next(error);
    }
};

export const getLoanById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const { id } = req.params;

        const loan = loans.find((loan) => loan.id === Number(id));

        if (!loan) {
            throw new ServiceError(
                "loan application not found",
                "LOAN_NOT_FOUND",
                HTTP_STATUS.NOT_FOUND
            );
        }

        res.status(HTTP_STATUS.OK).json({
            message: "loan application retrieved",
            data: loan
        });

    } catch (error) {
        next(error);
    }
};

export const createLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const { applicant, amount } = req.body;

        const newLoan: Loan = {
            id: loans.length + 1,
            applicant,
            amount,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        loans.push(newLoan);

        res.status(HTTP_STATUS.CREATED).json({
            message: "loan application created",
            data: newLoan
        });

    } catch (error) {
        next(error);
    }
};

export const updateLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const loan = loans.find((loan) => loan.id === Number(id));

        if (!loan) {
            throw new ServiceError(
                "loan application not found",
                "LOAN_NOT_FOUND",
                HTTP_STATUS.NOT_FOUND
            );
        }

        loan.status = status;

        res.status(HTTP_STATUS.OK).json({
            message: "Loan application updated",
            data: loan
        });

    } catch (error) {
        next(error);
    }
};

export const deleteLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const { id } = req.params;

        const loanIndex = loans.findIndex(
            (loan) => loan.id === Number(id)
        );

        if (loanIndex === -1) {
            throw new ServiceError(
                "loan application not found",
                "LOAN_NOT_FOUND",
                HTTP_STATUS.NOT_FOUND
            );
        }

        loans.splice(loanIndex, 1);

        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "loan application deleted")
        );

    } catch (error) {
        next(error);
    }
};