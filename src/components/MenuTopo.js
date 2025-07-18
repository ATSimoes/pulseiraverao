import React from "react";
import { AppBar, Toolbar, Tabs, Tab } from "@mui/material";

export default function MenuTopo({ paginaAtual, setPaginaAtual, isAdmin }) {
  const tabs = [
    { value: "menu", label: "Menu Inicial" },
    { value: "registo", label: "Registo de Pulseiras" },
    { value: "historico", label: "Histórico de Vendas" },
    { value: "estatisticas", label: "Estatísticas" },
  ];
  if (isAdmin) tabs.push({ value: "gestao", label: "Gestão de Utilizadores" });

  return (
    <AppBar position="static" sx={{ mb: 3, bgcolor: "#1565c0" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Tabs
          value={paginaAtual}
          onChange={(e, v) => setPaginaAtual(v)}
          textColor="inherit"
          TabIndicatorProps={{ style: { background: "#ffeb3b", height: 4 } }}
          variant="fullWidth"
          sx={{ width: "100%" }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: 17,
                "&.Mui-selected": {
                  color: "#ffeb3b",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
