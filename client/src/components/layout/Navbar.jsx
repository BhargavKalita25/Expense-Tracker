import React from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo.svg";
import { logout } from "../../store/slices/authSlice";

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ theme }) => theme.bgLight || "#242526"};
  border-bottom: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Logo = styled.img`
  height: 38px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const Links = styled.nav`
  display: flex;
  gap: 8px;
`;

const LinkNav = styled(NavLink)`
  padding: 8px 14px;
  border-radius: 8px;
  color: ${({ theme }) => theme.text_secondary || "#B0B3B8"};
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text_primary || "#FFFFFF"};
    background: rgba(255, 255, 255, 0.05);
  }

  &.active {
    color: #FFFFFF;
    background: ${({ theme }) => theme.primary || "#4E71FF"};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserPill = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.card || "#1E1E1E"};
  border: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary || "#FFFFFF"};
`;

const LogoutBtn = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.red || "#FF4D4F"}40;
  background: transparent;
  color: ${({ theme }) => theme.red || "#FF4D4F"};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.red || "#FF4D4F"}18;
    border-color: ${({ theme }) => theme.red || "#FF4D4F"};
  }
`;

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <Container>
      <Left>
        <Logo src={logo} alt="Expense Tracker" onClick={() => navigate("/")} />
        <Links>
          <LinkNav to="/">Dashboard</LinkNav>
          <LinkNav to="/budget">Budget & CSV</LinkNav>
        </Links>
      </Left>

      <Right>
        {user?.name && <UserPill>{user.name}</UserPill>}
        <LogoutBtn type="button" onClick={handleLogout}>
          Logout
        </LogoutBtn>
      </Right>
    </Container>
  );
}
