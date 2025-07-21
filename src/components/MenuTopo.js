import React from "react";
import { AppBar, Toolbar, Tabs, Tab, ButtonBase } from "@mui/material";

export default function MenuTopo({ paginaAtual, setPaginaAtual, isAdmin }) {
  const tabs = [
    { value: "menu", label: "Menu Inicial" },
    { value: "registo", label: "Registo de Pulseiras" },
    { value: "historico", label: "Histórico de Vendas" },
    { value: "estatisticas", label: "Estatísticas" },
    { value: "horarios", label: "Horário" },
  ];
  if (isAdmin) tabs.push({ value: "gestao", label: "Gestão de Utilizadores" });
  if (isAdmin) tabs.push({ value: "admin", label: "Vendas Totais Admin" });
  if (isAdmin) tabs.push({ value: "alertas", label: "Enviar Alertas" });

  return (
    <AppBar position="static" sx={{ mb: 3, bgcolor: "#1565c0" }}>
      <Toolbar
        sx={{
          px: { xs: 1, md: 3 },
          minHeight: { xs: 60, sm: 74 },
          justifyContent: "flex-start",
          alignItems: "center",
          position: "relative"
        }}
      >
        {/* LOGO fixo à esquerda */}
        <ButtonBase
          onClick={() => setPaginaAtual("menu")}
          sx={{
            mr: 3,
            borderRadius: 2,
            p: 0.2,
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: "0 2px 8px #0002" }
          }}
          aria-label="Ir para Menu Principal"
        >
          <img
            src="/bg-main.png"
            alt="Logo"
            style={{
              height: 40,
              width: "auto",
              borderRadius: 6,
              background: "#fff"
            }}
          />
        </ButtonBase>

        <Tabs
  value={paginaAtual}
  onChange={(e, v) => setPaginaAtual(v)}
  textColor="inherit"
  TabIndicatorProps={{ style: { background: "#ffeb3b", height: 4 } }}
  variant="scrollable"
  scrollButtons="auto"  // << ativa setas só quando precisa
  sx={{
    width: "100%",
    ".MuiTab-root": { minWidth: { xs: 90, sm: 120 }, px: { xs: 1, sm: 2 } }
  }}
>
  {tabs.map((tab) => (
    <Tab
      key={tab.value}
      value={tab.value}
      label={tab.label}
      sx={{
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        "&.Mui-selected": {
          color: "#ffeb3b",
          bgcolor: "rgba(255,255,255,0.13)",
        },
      }}
    />
  ))}
</Tabs>
      </Toolbar>
    </AppBar>
  );
}
