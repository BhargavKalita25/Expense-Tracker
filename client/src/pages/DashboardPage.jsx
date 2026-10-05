import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import SpendingLineChart from "../components/charts/SpendingLineChart";
import AddExpenseModal from "../components/features/expenses/AddExpenseModal";
import ExpenseTable from "../components/features/expenses/ExpenseTable";
import { addExpense, deleteExpense, getExpenses } from "../services/api";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
`;

const SectionRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  flex: 1;
  min-width: 320px;
  padding: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.card || theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const CardTitle = styled.h2`
  font-weight: 700;
  font-size: 18px;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const ChartToggleBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.primary : theme.border || "#3A3B3C")};
  background: ${({ theme, $active }) => ($active ? theme.primary : "transparent")};
  color: ${({ theme, $active }) => ($active ? "#FFFFFF" : theme.text_secondary)};
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    border-color: ${({ theme }) => theme.primary};
  }

  svg {
    font-size: 16px;
  }
`;

const TotalBadge = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  border-top: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  padding-top: 14px;
  margin-top: 12px;

  b {
    font-size: 20px;
    color: #4ade80;
  }
`;

const LoadingText = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
`;

export default function DashboardPage() {
  const [expenseData, setExpenseData] = useState([]);
  const [chartType, setChartType] = useState("pie");
  const [loading, setLoading] = useState(true);

  const totals = useMemo(() => {
    return expenseData.reduce(
      (sum, e) => sum + (parseFloat(e.amount) || 0),
      0
    );
  }, [expenseData]);

  const refreshExpenses = async () => {
    try {
      const res = await getExpenses({ limit: 500 });
      setExpenseData(res.data || []);
    } catch (e) {
      console.error("Failed to load expenses:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshExpenses();
  }, []);

  const postExpense = async (data) => {
    try {
      await addExpense(data);
      await refreshExpenses();
    } catch (e) {
      console.error("Failed to add expense:", e);
      alert(e?.response?.data?.message || "Failed to add expense");
    }
  };

  const removeExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }
    try {
      await deleteExpense(id);
      await refreshExpenses();
    } catch (e) {
      console.error("Failed to delete expense:", e);
      alert(e?.response?.data?.message || "Failed to delete expense");
    }
  };

  return (
    <Container>
      <SectionRow>
        <Card style={{ flex: 1.4 }}>
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <ButtonGroup>
              <ChartToggleBtn
                type="button"
                $active={chartType === "pie"}
                onClick={() => setChartType("pie")}
              >
                <PieChartOutlineIcon /> Pie
              </ChartToggleBtn>
              <ChartToggleBtn
                type="button"
                $active={chartType === "bar"}
                onClick={() => setChartType("bar")}
              >
                <BarChartIcon /> Bar
              </ChartToggleBtn>
              <ChartToggleBtn
                type="button"
                $active={chartType === "line"}
                onClick={() => setChartType("line")}
              >
                <ShowChartIcon /> Line
              </ChartToggleBtn>
            </ButtonGroup>
          </CardHeader>

          {loading ? (
            <LoadingText>Loading spending data...</LoadingText>
          ) : (
            <div>
              {chartType === "bar" ? (
                <MonthlyBarChart data={expenseData} />
              ) : chartType === "line" ? (
                <SpendingLineChart data={expenseData} />
              ) : (
                <CategoryPieChart data={expenseData} />
              )}
            </div>
          )}

          <TotalBadge>
            <span>Total Expenses:</span>
            <b>₹{totals.toFixed(2)}</b>
            <span style={{ fontSize: 12 }}>({expenseData.length} records)</span>
          </TotalBadge>
        </Card>

        <AddExpenseModal onAddExpense={postExpense} />
      </SectionRow>

      <SectionRow>
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          {loading ? (
            <LoadingText>Loading expenses list...</LoadingText>
          ) : (
            <ExpenseTable list={expenseData} onDeleteExpense={removeExpense} />
          )}
        </Card>
      </SectionRow>
    </Container>
  );
}
