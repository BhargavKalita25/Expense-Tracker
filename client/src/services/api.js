import axios from "axios";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5100/api";

const API = axios.create({ baseURL });

// Request interceptor: attach bearer token from Redux store
API.interceptors.request.use((config) => {
  try {
    const state = store.getState();
    const token = state?.auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // fallback if store not yet ready
  }
  return config;
});

// Response interceptor: handle 401 unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const state = store.getState();
      if (state?.auth?.token) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

// ---------- Auth Endpoints ----------
export const userSignUp = (data) => API.post("/auth/signup", data);
export const userSignIn = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ---------- Category Endpoints ----------
export const addCategory = (data) => API.post("/categories", data);
export const getCategoryList = () => API.get("/categories");
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// ---------- Expense Endpoints ----------
export const addExpense = (data) => API.post("/expenses", data);
export const getExpenses = (params) => API.get("/expenses", { params });
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);

// ---------- CSV Bulk Import ----------
export const importExpensesCSV = (rows) => API.post("/expenses/import/csv", { rows });

export default API;
