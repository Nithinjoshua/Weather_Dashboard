import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#D0BCFF" : "#6750A4", // Material 3 primary
      },
      secondary: {
        main: mode === "dark" ? "#CCC2DC" : "#625B71",
      },
      background: {
        default: mode === "dark" ? "#1C1B1F" : "#FFFBFE",
        paper: mode === "dark" ? "#2B2930" : "#F3EDF7",
      },
      surface: {
        main: mode === "dark" ? "#49454F" : "#E7E0EC",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 500 },
      h2: { fontWeight: 500 },
      h3: { fontWeight: 500 },
      h4: { fontWeight: 500 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            padding: "8px 20px",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            border: "1px solid transparent",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
