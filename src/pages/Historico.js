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
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Historico({ onVoltar }) {
  const [todasAsVendas, setTodasAsVendas] = useState([]);
  const [diasDisponiveis, setDiasDisponiveis] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [vendasSelecionadas, setVendasSelecionadas] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "vendas"), (snapshot) => {
      const vendas = snapshot.docs.map((doc) => doc.data());
      setTodasAsVendas(vendas);

      // Extrai datas únicas formatadas como AAAA-MM-DD
      const datas = Array.from(
        new Set(
          vendas
            .map((v) => v.dataISO?.substring(0, 10))
            .filter((d) => !!d)
        )
      ).sort((a, b) => b.localeCompare(a)); // ordenado decrescente
      setDiasDisponiveis(datas);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (diaSelecionado) {
      const filtradas = todasAsVendas.filter((v) =>
        v.dataISO?.startsWith(diaSelecionado)
      );
      setVendasSelecionadas(filtradas);
    } else {
      setVendasSelecionadas([]);
    }
  }, [diaSelecionado, todasAsVendas]);

  return (
    <Box>
      <Button onClick={onVoltar} variant="outlined" sx={{ mb: 2 }}>
        Voltar ao Menu
      </Button>

      <Typography variant="h5">Histórico de Vendas</Typography>

      {diasDisponiveis.length === 0 && (
        <Typography sx={{ mt: 2 }}>
          Ainda não existem vendas guardadas.
        </Typography>
      )}

      {diasDisponiveis.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography>Seleciona um dia:</Typography>
          <Stack direction="row" spacing={2} sx={{ my: 2, flexWrap: "wrap" }}>
            {diasDisponiveis.map((data) => (
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
