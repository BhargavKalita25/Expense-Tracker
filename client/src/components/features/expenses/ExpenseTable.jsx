import React from "react";
import styled from "styled-components";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border || "#3A3B3C"};
    border-radius: 4px;
  }
`;

const ExpenseRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  font-size: 14px;
  background: ${({ theme }) => theme.expenseDisplay || "#1E1E1E"};
  border: 1px solid ${({ theme }) => theme.border || "#2A2A2A"};
  padding: 12px 14px;
  gap: 12px;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.bgLight};
  }
`;

const DateCell = styled.div`
  flex: 0.8;
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  white-space: nowrap;
`;

const DescCell = styled.div`
  flex: 2;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CatBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: ${({ theme }) => theme.primary}18;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary}30;
  white-space: nowrap;
`;

const AmountCell = styled.div`
  flex: 1;
  text-align: right;
  font-weight: 600;
  font-size: 15px;
  color: #4ade80;
`;

const DeleteBtn = styled.button`
  border-radius: 8px;
  padding: 6px 8px;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.red || "#FF4D4F"}20;
    color: ${({ theme }) => theme.red || "#FF4D4F"};
    border-color: ${({ theme }) => theme.red || "#FF4D4F"}40;
  }
`;

const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

export default React.memo(function ExpenseTable({ list = [], onDeleteExpense }) {
  if (!list || list.length === 0) {
    return <EmptyState>No expenses logged yet. Add your first expense above!</EmptyState>;
  }

  return (
    <ListContainer>
      {list.map((exp) => (
        <ExpenseRow key={exp._id}>
          <DateCell title={exp.dateStr}>{exp.dateStr}</DateCell>
          <DescCell title={exp.description}>{exp.description}</DescCell>
          <div>
            <CatBadge>{exp.categoryName || "General"}</CatBadge>
          </div>
          <AmountCell>₹{Number(exp.amount || 0).toFixed(2)}</AmountCell>
          <DeleteBtn
            type="button"
            title="Delete Expense"
            onClick={() => onDeleteExpense && onDeleteExpense(exp._id)}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </DeleteBtn>
        </ExpenseRow>
      ))}
    </ListContainer>
  );
});
