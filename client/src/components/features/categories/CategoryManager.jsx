import React, { useState } from "react";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import CategoryBadge from "./CategoryBadge";
import Button from "../../common/Button";
import Input from "../../common/Input";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FormRow = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 4px;
`;

const EmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
`;

export default function CategoryManager({ addNewCategory, list = [], onDelete }) {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    addNewCategory(trimmed);
    setCategoryName("");
  };

  return (
    <Container>
      <FormRow onSubmit={handleSubmit}>
        <Input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="New category name..."
        />
        <Button
          type="submit"
          icon={<AddIcon sx={{ fontSize: 18 }} />}
          style={{ whiteSpace: "nowrap" }}
        >
          Add
        </Button>
      </FormRow>

      <CategoryList>
        {list.length === 0 ? (
          <EmptyState>No custom categories yet. Add one above!</EmptyState>
        ) : (
          list.map((category) => (
            <CategoryBadge
              key={category._id}
              id={category._id}
              name={category.categoryName}
              onDelete={onDelete}
            />
          ))
        )}
      </CategoryList>
    </Container>
  );
}
