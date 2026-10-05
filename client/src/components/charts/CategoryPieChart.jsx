import React, { useMemo } from "react";
import styled from "styled-components";
import { PieChart } from "@mui/x-charts";

const EmptyNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const CategoryPieChart = React.memo(function CategoryPieChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const totals = {};
    data.forEach((item) => {
      const cat = (item.categoryName || "General").trim();
      const amt = parseFloat(item.amount) || 0;
      totals[cat] = (totals[cat] || 0) + amt;
    });

    return Object.entries(totals).map(([label, value], idx) => ({
      id: idx,
      label,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return <EmptyNotice>No expense data available for pie chart.</EmptyNotice>;
  }

  return (
    <PieChart
      series={[
        {
          data: chartData,
          innerRadius: 35,
          outerRadius: 85,
          cx: "50%",
          cy: "40%",
          paddingAngle: 3,
          cornerRadius: 6,
          highlightScope: { fade: "global", highlight: "item" },
        },
      ]}
      margin={{ top: 10, bottom: 65, left: 10, right: 10 }}
      slotProps={{
        legend: {
          direction: "row",
          position: { vertical: "bottom", horizontal: "middle" },
          padding: 0,
          labelStyle: {
            fill: "#FFFFFF",
            fontSize: 12,
            fontWeight: 500,
          },
        },
      }}
      sx={{
        "& .MuiChartsLegend-series text, & .MuiChartsLegend-label, & text": {
          fill: "#FFFFFF !important",
        },
      }}
      height={320}
    />
  );
});

export default CategoryPieChart;
