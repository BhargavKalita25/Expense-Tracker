import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import logo from "../assets/logo.svg";
import SignInCard from "../components/features/auth/SignInCard";
import SignUpCard from "../components/features/auth/SignUpCard";
import { clearError } from "../store/slices/authSlice";

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  background: ${({ theme }) => theme.bg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: radial-gradient(circle at center, ${({ theme }) => theme.bgLight} 0%, ${({ theme }) => theme.bg} 100%);
  border-right: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};

  @media (max-width: 768px) {
    min-height: 200px;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
    padding: 30px 20px;
  }
`;

const Logo = styled.img`
  width: 240px;
  max-width: 90%;
  height: auto;
  filter: drop-shadow(0 8px 24px rgba(78, 113, 255, 0.25));
`;

const Right = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
`;

const SwitchText = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  cursor: pointer;
  padding: 0 4px;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleToggle = (loginState) => {
    dispatch(clearError());
    setIsLogin(loginState);
  };

  return (
    <Container>
      <Left>
        <Logo src={logo} alt="Expense Tracker Logo" />
      </Left>
      <Right>
        {isLogin ? (
          <>
            <SignInCard />
            <SwitchText>
              Don&apos;t have an account?{" "}
              <TextButton type="button" onClick={() => handleToggle(false)}>
                Sign Up
              </TextButton>
            </SwitchText>
          </>
        ) : (
          <>
            <SignUpCard />
            <SwitchText>
              Already have an account?{" "}
              <TextButton type="button" onClick={() => handleToggle(true)}>
                Sign In
              </TextButton>
            </SwitchText>
          </>
        )}
      </Right>
    </Container>
  );
}
