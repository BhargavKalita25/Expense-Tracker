import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { darkTheme, muiDarkTheme } from "./styles/theme";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import BudgetPage from "./pages/BudgetPage";

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export default function App() {
  const token = useSelector((s) => s.auth.token);

  return (
    <MuiThemeProvider theme={muiDarkTheme}>
      <StyledThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <AppContainer>
            {token && <Navbar />}
            <MainContent>
              <Routes>
                <Route
                  path="/auth"
                  element={token ? <Navigate to="/" replace /> : <AuthPage />}
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budget"
                  element={
                    <ProtectedRoute>
                      <BudgetPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to={token ? "/" : "/auth"} replace />} />
              </Routes>
            </MainContent>
          </AppContainer>
        </BrowserRouter>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}
