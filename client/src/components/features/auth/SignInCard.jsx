import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../common/Button";
import Input from "../../common/Input";
import { userSignIn } from "../../../services/api";
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
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
`;

const GlobalError = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.red || "#FF4D4F"};
  background: ${({ theme }) => (theme.red ? `${theme.red}18` : "rgba(255, 77, 79, 0.1)")};
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => (theme.red ? `${theme.red}40` : "rgba(255, 77, 79, 0.3)")};
`;

export default function SignInCard() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    if (error) dispatch(clearError());
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(authFailure("Please fill in both email and password"));
      return;
    }

    dispatch(authStart());
    try {
      const res = await userSignIn(formData);
      dispatch(authSuccess(res.data));
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      dispatch(authFailure(msg));
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <HeaderGroup>
        <Title>Welcome Back</Title>
        <Subtitle>Please enter your credentials to access your financial dashboard.</Subtitle>
      </HeaderGroup>

      {error && <GlobalError>{error}</GlobalError>}

      <Input
        label="Email Address"
        placeholder="you@example.com"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        name="password"
        password
        value={formData.password}
        onChange={handleChange}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        isLoading={loading}
        fullWidth
        style={{ marginTop: 8 }}
      >
        Sign In
      </Button>
    </FormContainer>
  );
}
