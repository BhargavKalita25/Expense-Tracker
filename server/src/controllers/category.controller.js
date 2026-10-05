import Category from "../models/category.model.js";

export async function listCategories(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const categories = Category.findByUser(userId);
    return res.status(200).json(categories);
  } catch (err) {
    console.error("List categories error:", err);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
}

export async function createCategory(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const { categoryName } = req.body || {};
    const name = (categoryName || "").trim();
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = Category.findByName(userId, name);
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = Category.create({ userId, categoryName: name });
    return res.status(201).json(category);
  } catch (e) {
    console.error("Create category error:", e);
    return res.status(500).json({ message: "Failed to create category" });
  }
}

export async function deleteCategory(req, res) {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;

    const success = Category.deleteById(id, userId);
    if (!success) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    return res.status(500).json({ message: "Failed to delete category" });
  }
}
