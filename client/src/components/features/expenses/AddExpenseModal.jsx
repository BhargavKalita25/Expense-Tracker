import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { getCategoryList } from "../../../services/api";

const ExpenseCard = styled.div`
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;
  background: ${({ theme }) => theme.card || theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_primary};
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 18px;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }

  option {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const DatePickerWrapper = styled.div`
  flex: 1;

  .MuiInputBase-root {
    color: ${({ theme }) => theme.text_primary};
    background: ${({ theme }) => theme.bg};
    border-radius: 8px;
    font-size: 14px;
    height: 42px;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.border || "#3A3B3C"};
  }

  .MuiSvgIcon-root {
    color: ${({ theme }) => theme.text_primary};
  }
`;

export default React.memo(function AddExpenseModal({ onAddExpense }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await getCategoryList();
      const data = res.data || [];
      setCategoryList(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0]._id);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategorySelectChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleAddExpenseClick = async () => {
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    let categoryId = selectedCategoryId;
    let categoryName = "";

    if (categoryId === "custom" || categoryList.length === 0) {
      if (!customCategory.trim()) {
        alert("Please enter a category name");
        return;
      }
      categoryName = customCategory.trim();
      categoryId = null;
    } else {
      const selected = categoryList.find((c) => c._id === categoryId);
      if (selected) {
        categoryName = selected.categoryName;
      }
    }

    const jsDate = date && date.isValid && date.isValid() ? date.toDate() : new Date();
    const dateStr = jsDate.toISOString().split("T")[0];

    setIsSubmitting(true);
    try {
      await onAddExpense({
        dateStr,
        description: description.trim(),
        amount: numericAmount,
        categoryId,
        categoryName,
      });

      setDescription("");
      setAmount("");
      setCustomCategory("");
      if (categoryId === "custom") {
        await loadCategories();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ExpenseCard>
      <Title>Add New Expense</Title>

      <Input
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="e.g. Groceries, Coffee, Electric bill"
        label="Description"
      />

      <Input
        name="amount"
        value={amount}
        onChange={(val) => setAmount(val)}
        type="text"
        placeholder="0.00"
        validateFloat
        label="Amount (₹)"
      />

      <Row>
        <Select
          value={selectedCategoryId}
          onChange={handleCategorySelectChange}
        >
          {categoryList.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
          <option value="custom">+ Create New Category</option>
        </Select>

        <DatePickerWrapper>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={date}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </LocalizationProvider>
        </DatePickerWrapper>
      </Row>

      {(selectedCategoryId === "custom" || categoryList.length === 0) && (
        <Input
          name="customCategory"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          type="text"
          placeholder="New category name"
          label="Category Name"
        />
      )}

      <Button
        fullWidth
        isLoading={isSubmitting}
        onClick={handleAddExpenseClick}
      >
        Add Expense
      </Button>
    </ExpenseCard>
  );
});
