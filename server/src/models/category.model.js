import { db } from "../config/db.js";

export const CategoryModel = {
  findByUser(userId) {
    const stmt = db.prepare(`
      SELECT id, userId, categoryName, createdAt
      FROM categories
      WHERE userId = ?
      ORDER BY categoryName ASC
    `);
    const rows = stmt.all(Number(userId));
    return rows.map((r) => ({
      ...r,
      _id: String(r.id),
    }));
  },

  findByName(userId, categoryName) {
    const stmt = db.prepare(`
      SELECT id, userId, categoryName, createdAt
      FROM categories
      WHERE userId = ? AND categoryName = ? COLLATE NOCASE
    `);
    const row = stmt.get(Number(userId), categoryName.trim());
    if (!row) return null;
    return {
      ...row,
      _id: String(row.id),
    };
  },

  create({ userId, categoryName }) {
    const trimmed = categoryName.trim();
    const stmt = db.prepare(`
      INSERT INTO categories (userId, categoryName)
      VALUES (?, ?)
    `);
    const result = stmt.run(Number(userId), trimmed);
    const id = result.lastInsertRowid;
    return {
      _id: String(id),
      id: Number(id),
      userId: Number(userId),
      categoryName: trimmed,
    };
  },

  findOrCreate(userId, categoryName) {
    const existing = this.findByName(userId, categoryName);
    if (existing) return existing;
    return this.create({ userId, categoryName });
  },

  deleteById(id, userId) {
    const stmt = db.prepare(`
      DELETE FROM categories
      WHERE id = ? AND userId = ?
    `);
    const result = stmt.run(Number(id), Number(userId));
    return result.changes > 0;
  },
};

export default CategoryModel;
