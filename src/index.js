import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Material UI theme
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Fonte Inter do Google Fonts (opcional mas recomendada)
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Criar tema personalizado
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },        // azul principal
    secondary: { main: "#ffb300" },      // amarelo dourado
    background: {
      default: "#f3f6f9",                // cinzento claro de fundo
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
