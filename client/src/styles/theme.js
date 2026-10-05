import { createTheme } from "@mui/material/styles";

export const darkTheme = {
  bg: "#18191A",
  bgLight: "#242526",
  card: "#242526",
  primary: "#4E71FF",
  secondary: "#3A3B3C",

  text_primary: "#FFFFFF",
  text_secondary: "#B0B3B8",
  popup_text_secondary: "#9E9E9E",
  border_focus: "#4E71FF",
  red: "#FF4D4F",
  shadow: "rgba(0, 0, 0, 0.4)",
  button: "#4E71FF",
  border: "#3A3B3C",
  expenseDisplay: "#1E1E1E",
};

export const muiDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4E71FF",
    },
    background: {
      default: "#18191A",
      paper: "#242526",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B3B8",
    },
  },
  components: {
    MuiChartsLegend: {
      styleOverrides: {
        root: {
          "& text": {
            fill: "#FFFFFF !important",
          },
        },
        label: {
          fill: "#FFFFFF !important",
        },
        series: {
          "& text": {
            fill: "#FFFFFF !important",
          },
        },
      },
    },
    MuiChartsAxis: {
      styleOverrides: {
        root: {
          "& .MuiChartsAxis-line": {
            stroke: "#3A3B3C !important",
          },
          "& .MuiChartsAxis-tick": {
            stroke: "#3A3B3C !important",
          },
          "& .MuiChartsAxis-tickLabel": {
            fill: "#B0B3B8 !important",
          },
        },
      },
    },
  },
});

export default darkTheme;
