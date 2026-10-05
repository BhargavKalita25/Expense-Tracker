import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../common/Button";
import Input from "../../common/Input";
import { userSignUp } from "../../../services/api";
import { authStart, authSuccess, authFailure, clearError } from "../../../store/slices/authSlice";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 400px;
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const GlobalError = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.red || "#FF4D4F"};
  background: ${({ theme }) => (theme.red ? `${theme.red}18` : "rgba(255, 77, 79, 0.1)")};
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => (theme.red ? `${theme.red}40` : "rgba(255, 77, 79, 0.3)")};
`;

export default function SignUpCard() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    if (error) dispatch(clearError());
    if (localError) setLocalError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    dispatch(authStart());
    try {
      const res = await userSignUp({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      dispatch(authSuccess(res.data));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to create account";
      dispatch(authFailure(msg));
    }
  };

  const displayError = localError || error;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <HeaderGroup>
        <Title>Create an Account</Title>
        <Subtitle>Track expenses, budgets, and spending trends</Subtitle>
      </HeaderGroup>

      {displayError && <GlobalError>{displayError}</GlobalError>}

      <Input
        label="Full Name"
        placeholder="Enter your full name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        autoComplete="name"
      />

      <Input
        label="Email Address"
        placeholder="Enter your email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
      />

      <Input
        label="Password"
        placeholder="Create a password (min 6 characters)"
        name="password"
        password
        value={formData.password}
        onChange={handleChange}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        isLoading={loading}
        fullWidth
        style={{ marginTop: 8 }}
      >
        Create Account
      </Button>
    </FormContainer>
  );
}
