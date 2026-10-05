import express from "express";
import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  importCsv,
} from "../controllers/expense.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, listExpenses);
router.post("/", requireAuth, createExpense);
router.put("/:id", requireAuth, updateExpense);
router.delete("/:id", requireAuth, deleteExpense);
router.post("/import/csv", requireAuth, importCsv);

export default router;
