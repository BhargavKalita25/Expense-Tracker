import React from "react";
import styled from "styled-components";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  background: ${({ theme }) => theme.bg};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.bgLight};
  }
`;

const Name = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.red || "#FF4D4F"};
    background: ${({ theme }) => (theme.red ? `${theme.red}18` : "rgba(255, 77, 79, 0.1)")};
  }
`;

export default function CategoryBadge({ name, onDelete, id }) {
  return (
    <Container>
      <Name>{name}</Name>
      <DeleteBtn
        type="button"
        title="Delete Category"
        onClick={() => onDelete && onDelete(id)}
      >
        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
      </DeleteBtn>
    </Container>
  );
}
