import React, { useState } from "react";
import styled from "styled-components";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $hasError, theme }) => ($hasError ? theme.red || "#FF4D4F" : theme.text_secondary || "#B0B3B8")};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${({ $hasError, theme }) => ($hasError ? theme.red || "#FF4D4F" : theme.border || "#3A3B3C")};
  background-color: transparent;
  padding: ${({ $isTextarea }) => ($isTextarea ? "10px 14px" : "0 14px")};
  min-height: 42px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ $hasError, theme }) => ($hasError ? theme.red || "#FF4D4F" : theme.primary || "#4E71FF")};
  }
`;

const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  height: 42px;
  color: ${({ theme }) => theme.text_primary || "#FFFFFF"};
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.text_secondary || "#888888"}80;
  }
`;

const StyledTextarea = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  resize: vertical;
  color: ${({ theme }) => theme.text_primary || "#FFFFFF"};
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.text_secondary || "#888888"}80;
  }
`;

const ToggleIcon = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_secondary || "#B0B3B8"};
  padding: 4px;
  margin-left: 6px;

  &:hover {
    color: ${({ theme }) => theme.text_primary || "#FFFFFF"};
  }
`;

const ErrorMsg = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.red || "#FF4D4F"};
`;

export default function Input({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  error,
  multiline = false,
  rows = 3,
  validateFloat = false,
  password = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    if (!onChange) return;
    const val = e.target.value;

    if (validateFloat) {
      if (val === "" || /^\d*\.?\d*$/.test(val)) {
        onChange(val);
      }
      return;
    }

    onChange(e);
  };

  const isPassword = password || type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <Container>
      {label && <Label $hasError={Boolean(error)}>{label}</Label>}
      <InputWrapper $hasError={Boolean(error)} $isTextarea={multiline}>
        {multiline ? (
          <StyledTextarea
            name={name}
            value={value ?? ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={rows}
            {...props}
          />
        ) : (
          <StyledInput
            type={inputType}
            name={name}
            value={value ?? ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            {...props}
          />
        )}

        {isPassword && (
          <ToggleIcon
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
          </ToggleIcon>
        )}
      </InputWrapper>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </Container>
  );
}
