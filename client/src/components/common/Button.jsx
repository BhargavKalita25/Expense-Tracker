import React from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

const StyledBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;

  /* Size Variants */
  ${({ $size }) => {
    switch ($size) {
      case "sm":
        return `
          padding: 6px 12px;
          font-size: 13px;
        `;
      case "lg":
        return `
          padding: 14px 28px;
          font-size: 16px;
        `;
      default:
        return `
          padding: 10px 20px;
          font-size: 14px;
        `;
    }
  }}

  /* Full Width */
  ${({ $fullWidth }) => $fullWidth && "width: 100%;"}

  /* Style Variants */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case "secondary":
        return `
          background: ${theme.secondary || "#3A3B3C"};
          border: 1px solid ${theme.border || "#3A3B3C"};
          color: ${theme.text_primary || "#FFFFFF"};
          &:hover:not(:disabled) {
            background: ${theme.card || "#242526"};
          }
        `;
      case "outlined":
        return `
          background: transparent;
          border: 1px solid ${theme.primary || "#4E71FF"};
          color: ${theme.primary || "#4E71FF"};
          &:hover:not(:disabled) {
            background: ${theme.primary}18;
          }
        `;
      case "ghost":
        return `
          background: transparent;
          border: 1px solid transparent;
          color: ${theme.text_secondary || "#B0B3B8"};
          &:hover:not(:disabled) {
            color: ${theme.text_primary || "#FFFFFF"};
            background: rgba(255, 255, 255, 0.05);
          }
        `;
      default:
        return `
          background: ${theme.primary || "#4E71FF"};
          border: 1px solid ${theme.primary || "#4E71FF"};
          color: #FFFFFF;
          &:hover:not(:disabled) {
            opacity: 0.92;
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function Button({
  children,
  text,
  icon,
  component,
  isLoading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  onClick,
  style,
  ...props
}) {
  const isActionDisabled = disabled || isLoading;
  const content = children || text;
  const leadIcon = icon || component;

  return (
    <StyledBtn
      type={type}
      onClick={isActionDisabled ? undefined : onClick}
      disabled={isActionDisabled}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      style={style}
      {...props}
    >
      {isLoading ? (
        <CircularProgress size={16} sx={{ color: "inherit" }} />
      ) : (
        leadIcon
      )}
      {content && <span>{content}</span>}
    </StyledBtn>
  );
}
