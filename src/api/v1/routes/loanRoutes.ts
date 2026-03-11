import { Router } from "express";

import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
} from "../controllers/loanControllers";

import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

router.get(
  "/",
  authenticate,
  getLoans
);

router.get(
  "/:id",
  authenticate,
  getLoanById
);

router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["admin", "manager"] }),
  createLoan
);

router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin", "manager"] }),
  updateLoan
);

router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  deleteLoan
);

export default router;