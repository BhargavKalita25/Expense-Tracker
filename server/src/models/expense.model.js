import { db } from "../config/db.js";

export const ExpenseModel = {
  list({ userId, start, end, limit = 200 }) {
    let query = `
      SELECT id, userId, date, description, amount, categoryId, categoryName, createdAt
      FROM expenses
      WHERE userId = ?
    `;
    const params = [Number(userId)];

    if (start) {
      query += ` AND date >= ?`;
      params.push(start);
    }
    if (end) {
      query += ` AND date <= ?`;
      params.push(end);
    }

    query += ` ORDER BY date DESC, id DESC LIMIT ?`;
    params.push(Math.min(Math.max(parseInt(limit, 10) || 200, 1), 1000));

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map((r) => ({
      _id: String(r.id),
      id: Number(r.id),
      date: r.date,
      dateStr: r.date,
      description: r.description,
      amount: Number(r.amount),
      categoryId: r.categoryId ? String(r.categoryId) : null,
      categoryName: r.categoryName,
      createdAt: r.createdAt,
    }));
  },

  create({ userId, date, description, amount, categoryId = null, categoryName }) {
    const stmt = db.prepare(`
      INSERT INTO expenses (userId, date, description, amount, categoryId, categoryName)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      Number(userId),
      date,
      description.trim(),
      Number(amount),
      categoryId ? Number(categoryId) : null,
      categoryName.trim()
    );
    const id = result.lastInsertRowid;
    return {
      _id: String(id),
      id: Number(id),
      date,
      dateStr: date,
      description: description.trim(),
      amount: Number(amount),
      categoryId: categoryId ? String(categoryId) : null,
      categoryName: categoryName.trim(),
    };
  },

  updateById(id, userId, patch) {
    const fields = [];
    const values = [];

    if (patch.description !== undefined) {
      fields.push("description = ?");
      values.push(patch.description.trim());
    }
    if (patch.amount !== undefined) {
      fields.push("amount = ?");
      values.push(Number(patch.amount));
    }
    if (patch.date !== undefined) {
      fields.push("date = ?");
      values.push(patch.date);
    }
    if (patch.categoryId !== undefined) {
      fields.push("categoryId = ?");
      values.push(patch.categoryId ? Number(patch.categoryId) : null);
    }
    if (patch.categoryName !== undefined) {
      fields.push("categoryName = ?");
      values.push(patch.categoryName.trim());
    }

    if (fields.length === 0) return null;

    values.push(Number(id), Number(userId));
    const stmt = db.prepare(`
      UPDATE expenses
      SET ${fields.join(", ")}
      WHERE id = ? AND userId = ?
    `);
    const result = stmt.run(...values);
    if (result.changes === 0) return null;

    // Fetch and return updated row
    const getStmt = db.prepare(`
      SELECT id, userId, date, description, amount, categoryId, categoryName, createdAt
      FROM expenses
      WHERE id = ?
    `);
    const row = getStmt.get(Number(id));
    if (!row) return null;

    return {
      _id: String(row.id),
      id: Number(row.id),
      date: row.date,
      dateStr: row.date,
      description: row.description,
      amount: Number(row.amount),
      categoryId: row.categoryId ? String(row.categoryId) : null,
      categoryName: row.categoryName,
      createdAt: row.createdAt,
    };
  },

  deleteById(id, userId) {
    const stmt = db.prepare(`
      DELETE FROM expenses
      WHERE id = ? AND userId = ?
    `);
    const result = stmt.run(Number(id), Number(userId));
    return result.changes > 0;
  },

  bulkInsert(expenses) {
    if (!expenses || expenses.length === 0) return 0;

    const stmt = db.prepare(`
      INSERT INTO expenses (userId, date, description, amount, categoryId, categoryName)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    db.exec("BEGIN TRANSACTION;");
    try {
      for (const e of expenses) {
        stmt.run(
          Number(e.userId),
          e.date,
          e.description.trim(),
          Number(e.amount),
          e.categoryId ? Number(e.categoryId) : null,
          e.categoryName.trim()
        );
      }
      db.exec("COMMIT;");
      return expenses.length;
    } catch (error) {
      db.exec("ROLLBACK;");
      throw error;
    }
  },
};

export default ExpenseModel;
