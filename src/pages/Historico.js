import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import { formatMoney } from "../utils/helpers";

export default function Historico({ onVoltar }) {
  const [historico, setHistorico] = useState({});
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [vendasSelecionadas, setVendasSelecionadas] = useState([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("historicoPulseiras") || "{}");
    setHistorico(h);
  }, []);

  useEffect(() => {
    if (diaSelecionado && historico[diaSelecionado]) {
      setVendasSelecionadas(historico[diaSelecionado]);
    } else {
      setVendasSelecionadas([]);
    }
  }, [diaSelecionado, historico]);

  return (
    <Box>
      <Button onClick={onVoltar} variant="outlined" sx={{ mb: 2 }}>
        Voltar ao Menu
      </Button>
      <Typography variant="h5">Histórico de Vendas</Typography>
      {Object.keys(historico).length === 0 && (
        <Typography sx={{ mt: 2 }}>
          Ainda não existem vendas guardadas.
        </Typography>
      )}
      {Object.keys(historico).length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography>Seleciona um dia:</Typography>
          <Stack direction="row" spacing={2} sx={{ my: 2, flexWrap: "wrap" }}>
            {Object.keys(historico)
              .sort((a, b) => b.localeCompare(a))
              .map((data) => (
                <Button
                  key={data}
                  variant={data === diaSelecionado ? "contained" : "outlined"}
                  onClick={() => setDiaSelecionado(data)}
                >
                  {data}
                </Button>
              ))}
          </Stack>
          {vendasSelecionadas.length > 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Número</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Operador</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendasSelecionadas.map((venda, i) => (
                    <TableRow
                      key={i}
                      style={
                        venda.tipo === "Pack Família"
                          ? { backgroundColor: "#fff8e1" }
                          : undefined
                      }
                    >
                      <TableCell>{venda.numero}</TableCell>
                      <TableCell>{venda.tipo}</TableCell>
                      <TableCell>{formatMoney(venda.preco)}</TableCell>
                      <TableCell>{venda.hora}</TableCell>
                      <TableCell>{venda.operador || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
}
