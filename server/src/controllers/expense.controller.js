import Expense from "../models/expense.model.js";
import Category from "../models/category.model.js";

function parseDateStr(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  return null;
}

function formatDateDisplay(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export async function listExpenses(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const { start, end, limit = 200 } = req.query;

    const items = Expense.list({
      userId,
      start: start ? formatDateDisplay(parseDateStr(start)) : null,
      end: end ? formatDateDisplay(parseDateStr(end)) : null,
      limit,
    });

    return res.status(200).json(items);
  } catch (err) {
    console.error("List expenses error:", err);
    return res.status(500).json({ message: "Failed to fetch expenses" });
  }
}

export async function createExpense(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const { dateStr, description, amount, categoryId, categoryName } = req.body || {};

    const desc = (description || "").trim();
    if (!desc) {
      return res.status(400).json({ message: "Description is required" });
    }

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 0) {
      return res.status(400).json({ message: "Amount must be a valid positive number" });
    }

    const dateObj = parseDateStr(dateStr) || new Date();
    const dateFormatted = formatDateDisplay(dateObj);

    let finalCategoryName = (categoryName || "").trim();
    let finalCategoryId = categoryId;

    if (!finalCategoryName && categoryId) {
      const userCats = Category.findByUser(userId);
      const matched = userCats.find((c) => String(c.id) === String(categoryId));
      if (matched) finalCategoryName = matched.categoryName;
    }

    if (finalCategoryName) {
      const cat = Category.findOrCreate(userId, finalCategoryName);
      finalCategoryId = cat.id;
      finalCategoryName = cat.categoryName;
    }

    if (!finalCategoryName) {
      finalCategoryName = "General";
    }

    const exp = Expense.create({
      userId,
      date: dateFormatted,
      description: desc,
      amount: amt,
      categoryId: finalCategoryId,
      categoryName: finalCategoryName,
    });

    return res.status(201).json(exp);
  } catch (err) {
    console.error("Create expense error:", err);
    return res.status(500).json({ message: "Failed to create expense" });
  }
}

export async function updateExpense(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;
    const { dateStr, description, amount, categoryId, categoryName } = req.body || {};

    const patch = {};
    if (description !== undefined) {
      const desc = (description || "").trim();
      if (!desc) return res.status(400).json({ message: "Description cannot be empty" });
      patch.description = desc;
    }

    if (amount !== undefined) {
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt < 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
      }
      patch.amount = amt;
    }

    if (dateStr !== undefined) {
      const d = parseDateStr(dateStr);
      if (!d) return res.status(400).json({ message: "Invalid date format" });
      patch.date = formatDateDisplay(d);
    }

    if (categoryName !== undefined || categoryId !== undefined) {
      const name = (categoryName || "").trim();
      if (name) {
        const cat = Category.findOrCreate(userId, name);
        patch.categoryId = cat.id;
        patch.categoryName = cat.categoryName;
      } else if (categoryId) {
        patch.categoryId = categoryId;
      }
    }

    const updated = Expense.updateById(id, userId, patch);
    if (!updated) return res.status(404).json({ message: "Expense not found" });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Update expense error:", err);
    return res.status(500).json({ message: "Failed to update expense" });
  }
}

export async function deleteExpense(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;

    const success = Expense.deleteById(id, userId);
    if (!success) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Delete expense error:", err);
    return res.status(500).json({ message: "Failed to delete expense" });
  }
}

export async function importCsv(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const rows = req.body?.rows;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "Rows array is required and must not be empty" });
    }

    if (rows.length > 5000) {
      return res.status(400).json({ message: "Batch size exceeds maximum limit of 5,000 rows" });
    }

    const validExpenses = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] || {};
      const dateObj = parseDateStr(r.dateStr) || new Date();
      const dateFormatted = formatDateDisplay(dateObj);
      const desc = (r.description || "").trim();
      const amt = Number(r.amount);
      const catName = (r.categoryName || "General").trim();

      if (!desc || !Number.isFinite(amt) || amt < 0) {
        errors.push({ row: i + 1, message: "Invalid description or amount" });
        continue;
      }

      const cat = Category.findOrCreate(userId, catName);
      validExpenses.push({
        userId,
        date: dateFormatted,
        description: desc,
        amount: amt,
        categoryId: cat.id,
        categoryName: cat.categoryName,
      });
    }

    if (validExpenses.length > 0) {
      Expense.bulkInsert(validExpenses);
    }

    return res.status(200).json({
      created: validExpenses.length,
      errors,
      totalRows: rows.length,
    });
  } catch (err) {
    console.error("Import CSV error:", err);
    return res.status(500).json({ message: "Failed to import CSV expenses" });
  }
}
