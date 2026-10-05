import { db } from "../config/db.js";

export const UserModel = {
  create({ name, email, password, img = null }) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, img)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(name, email.toLowerCase().trim(), password, img);
    const id = result.lastInsertRowid;
    return {
      _id: String(id),
      id: Number(id),
      name,
      email: email.toLowerCase().trim(),
      img,
    };
  },

  findByEmail(email) {
    const stmt = db.prepare(`
      SELECT id, name, email, password, img, createdAt
      FROM users
      WHERE email = ?
    `);
    const row = stmt.get(email.toLowerCase().trim());
    if (!row) return null;
    return {
      ...row,
      _id: String(row.id),
    };
  },

  findById(id) {
    const stmt = db.prepare(`
      SELECT id, name, email, img, createdAt
      FROM users
      WHERE id = ?
    `);
    const row = stmt.get(Number(id));
    if (!row) return null;
    return {
      ...row,
      _id: String(row.id),
    };
  },
};

export default UserModel;
