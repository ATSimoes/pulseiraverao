import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, Divider
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import Slide from "@mui/material/Slide";

const cores = ["#1976d2", "#2e7d32", "#ffd600"];

function tipoToCor(tipo) {
  const t = tipo.toLowerCase();
  if (t.includes("adulto")) return cores[0];
  if (t.includes("menor")) return cores[1];
  return cores[2];
}

export default function Estatisticas() {
  const [dados, setDados] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("historicoPulseiras") || "{}");
    const vendas = Object.values(h).flat();

    // Agg por tipo
    const porTipo = {};
    let totalAux = 0;
    vendas.forEach(v => {
      const t = v.tipo;
      porTipo[t] = (porTipo[t] || 0) + 1;
      totalAux += parseFloat(v.preco) || 0;
    });
    setTotal(totalAux);
    setDados(Object.entries(porTipo).map(([tipo, qt]) => ({ tipo, qt })));
    setPieData(Object.entries(porTipo).map(([tipo, qt]) => ({ name: tipo, value: qt })));
  }, []);

  return (
    <Slide in={true} direction="up" timeout={600}>
    <Paper elevation={3} sx={{ maxWidth: 1000, mx: "auto", p: 4, borderRadius: 4 }}> 
      <Typography variant="h4" color="primary" fontWeight={600} mb={2}>
        Dashboard Estatístico
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: "primary.light", borderRadius: 3, p: 2, color: "#fff" }}>
            <Typography variant="subtitle2">Total Vendas €</Typography>
            <Typography variant="h5" fontWeight={700}>
              {total.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Quantidade de registos: <b>{dados.reduce((s, d) => s + d.qt, 0)}</b>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Vendas por Tipo de Pulseira
          </Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dados}>
              <XAxis dataKey="tipo" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="qt">
                {dados.map((entry, idx) => (
                  <Cell key={entry.tipo} fill={tipoToCor(entry.tipo)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Distribuição Percentual
          </Typography>
          <ResponsiveContainer width="150%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={entry.name} fill={tipoToCor(entry.name)} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
    </Slide>
  );
}
