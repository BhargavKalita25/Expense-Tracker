import React, { useMemo } from "react";
import styled from "styled-components";
import { LineChart } from "@mui/x-charts";

const EmptyNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const SpendingLineChart = React.memo(function SpendingLineChart({ data = [] }) {
  const { dataset, categories } = useMemo(() => {
    if (!data || data.length === 0) {
      return { dataset: [], categories: [] };
    }

    const categorySet = new Set();
    const monthBuckets = {};

    data.forEach((item) => {
      const { categoryName, amount, dateStr, date } = item;
      const amt = parseFloat(amount) || 0;
      const cat = (categoryName || "General").trim();
      categorySet.add(cat);

      const d = new Date(date || dateStr);
      if (isNaN(d.getTime())) return;

      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      const sortKey = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
      const label = `${monthNames[monthIdx]} ${year}`;

      if (!monthBuckets[sortKey]) {
        monthBuckets[sortKey] = { month: label, _sortKey: sortKey };
      }

      monthBuckets[sortKey][cat] = (monthBuckets[sortKey][cat] || 0) + amt;
    });

    const sortedList = Object.values(monthBuckets).sort((a, b) =>
      a._sortKey.localeCompare(b._sortKey)
    );

    return {
      dataset: sortedList,
      categories: Array.from(categorySet),
    };
  }, [data]);

  if (!dataset || dataset.length === 0) {
    return <EmptyNotice>No expense data available for line chart.</EmptyNotice>;
  }

  const series = categories.map((cat) => ({
    label: cat,
    dataKey: cat,
  }));

  return (
    <LineChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "month" }]}
      series={series}
      height={340}
      margin={{ top: 50, bottom: 45, left: 55, right: 20 }}
      slotProps={{
        legend: {
          direction: "row",
          position: { vertical: "top", horizontal: "middle" },
          padding: 0,
          labelStyle: {
            fill: "#FFFFFF",
            fontSize: 12,
            fontWeight: 500,
          },
        },
      }}
      sx={{
        "& .MuiChartsAxis-tickLabel": {
          fill: "#B0B3B8 !important",
          fontSize: "12px !important",
        },
        "& .MuiChartsAxis-line": {
          stroke: "#3A3B3C !important",
        },
        "& .MuiChartsAxis-tick": {
          stroke: "#3A3B3C !important",
        },
        "& .MuiChartsLegend-series text, & .MuiChartsLegend-label, & .MuiChartsLegend-root text": {
          fill: "#FFFFFF !important",
          fontSize: "12px !important",
        },
        "& .MuiChartsGrid-line": {
          stroke: "#3A3B3C !important",
          strokeDasharray: "3 3",
        },
      }}
    />
  );
});

export default SpendingLineChart;
