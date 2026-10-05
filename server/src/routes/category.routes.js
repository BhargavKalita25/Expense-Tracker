import express from "express";
import {
  listCategories,
  createCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, listCategories);
router.post("/", requireAuth, createCategory);
router.delete("/:id", requireAuth, deleteCategory);

export default router;
