import React, { useState } from "react";
import {
  Typography,
  Button,
  Stack,
  TextField,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Grow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import { formatMoney } from "../utils/helpers";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";

export default function Registo({
  vendas,
  numeroAtual,
  setNumeroAtual,
  primeiroNumero,
  setPrimeiroNumero,
  novoNumero,
  setNovoNumero,
  inputBloqueado,
  setInputBloqueado,
  vendedor,
  operador,
  turnoAberto,
  abrirTurno,
  fecharTurno,
  horaAbertura,
  vender,
  venderAzul,
  exportarCSV,
  exportarPDF,
}) {
  const [numeroAzul, setNumeroAzul] = useState("");

  function iniciar() {
    setNumeroAtual(primeiroNumero);
    setInputBloqueado(true);
  }

  // Anular venda (apaga do Firestore)
  async function anularVenda(venda) {
    if (operador?.perfil !== "admin") {
      return alert("Só o admin pode anular vendas.");
    }
    if (!window.confirm("Deseja anular esta venda?")) return;
    try {
      await deleteDoc(doc(db, "vendas", venda.id));
    } catch (e) {
      alert("Erro ao anular venda.");
      console.error(e);
    }
  }

  return (
    <Grow in={true} timeout={650}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 1800,
          mx: "auto",
          p: 4,
          borderRadius: 5,
          mt: 3,
          mb: 2,
          bgcolor: "#fff",
        }}
      >
        <div>
          {/* Turno */}
          <Box sx={{ mb: 2 }}>
            {!operador && (
              <Typography color="error">
                Por favor autentique-se para abrir um turno.
              </Typography>
            )}
            {operador && !turnoAberto && (
              <Button
                onClick={abrirTurno}
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }}
              >
                Abrir Turno
              </Button>
            )}
            {turnoAberto && (
              <Button
                onClick={fecharTurno}
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }}
              >
                Fechar Turno
              </Button>
            )}
            {horaAbertura && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Turno iniciado às {horaAbertura.toLocaleTimeString("pt-PT")}
              </Typography>
            )}
          </Box>

          {/* Início da série */}
          {!inputBloqueado && (
            <Stack direction="row" spacing={2} mb={3}>
              <TextField
                label="Primeiro Nº de Pulseira"
                type="number"
                value={primeiroNumero}
                onChange={(e) =>
                  setPrimeiroNumero(Number(e.target.value))
                }
              />
              <Button
                onClick={iniciar}
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 8,
                  minWidth: 180,
                  fontWeight: 600,
                }}
              >
                Iniciar Vendas
              </Button>
            </Stack>
          )}

          {/* Botões e campos principais */}
          {inputBloqueado && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              mb={3}
              flexWrap="wrap"
            >
              <Button
                onClick={() => vender("adulto")}
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 8,
                  minWidth: 180,
                  fontWeight: 600,
                }}
                disabled={!turnoAberto}
              >
                Vender Pulseira Adulto (F1)
              </Button>
              <Button
                onClick={() => vender("menor")}
                startIcon={<AddIcon />}
                color="primary"
                variant="contained"
                sx={{
                  borderRadius: 8,
                  minWidth: 180,
                  fontWeight: 600,
                }}
                disabled={!turnoAberto}
              >
                Vender Pulseira Menor (F2)
              </Button>
              <Button
                onClick={() => vender("pack")}
                startIcon={<AddIcon />}
                variant="contained"
                sx={{
                  borderRadius: 8,
                  minWidth: 180,
                  fontWeight: 600,
                }}
                color="warning"
                disabled={!turnoAberto}
              >
                Pack Família (F3)
              </Button>

              {/* Mudar número da série */}
              <TextField
                label="Novo Nº"
                value={novoNumero}
                onChange={(e) => setNovoNumero(e.target.value)}
                type="number"
                size="small"
                sx={{ width: 130 }}
              />
              <Button
                onClick={() => {
                  if (novoNumero && !isNaN(novoNumero)) {
                    setNumeroAtual(Number(novoNumero));
                    setNovoNumero("");
                  }
                }}
                variant="outlined"
                size="small"
              >
                Mudar Série
              </Button>

              {/* Pulseira Azul */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                mt={2}
              >
                <TextField
                  label="Nº Pulseira Azul"
                  value={numeroAzul}
                  onChange={(e) => setNumeroAzul(e.target.value)}
                  type="number"
                  size="small"
                  variant="outlined"
                  sx={{
                    width: { xs: "100%", sm: 160 },
                    bgcolor: "#e3f2fd",
                  }}
                  inputProps={{ min: 1 }}
                />
                <Button
                  onClick={() => {
                    if (numeroAzul && !isNaN(numeroAzul)) {
                      venderAzul(numeroAzul);
                      setNumeroAzul("");
                    } else {
                      alert("Insere um número válido para a pulseira azul.");
                    }
                  }}
                  color="info"
                  variant="contained"
                  disabled={!turnoAberto || !operador}
                  sx={{
                    fontWeight: 600,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Vender Pulseira Azul
                </Button>
              </Stack>

              {/* Exportações */}
              <Button
                onClick={exportarCSV}
                startIcon={<AddIcon />}
                variant="outlined"
                color="primary"
                size="small"
                sx={{
                  borderRadius: 8,
                  minWidth: 180,
                  fontWeight: 600,
                }}
              >
                Exportar CSV
              </Button>
              <Button
                onClick={() => exportarPDF(vendas)}
                variant="outlined"
                size="small"
              >
                Exportar PDF
              </Button>
            </Stack>
          )}

          {/* Total */}
          <Typography variant="h6">
            Total vendido: {formatMoney(
              vendas.reduce((acc, v) => acc + parseFloat(v.preco || 0), 0)
            )}
          </Typography>

          {/* Tabela de vendas */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.light" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Número</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Valor</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hora</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Operador</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Anular</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendas.map((venda) => (
                  <TableRow
                    key={venda.id}
                    style={{
                      backgroundColor:
                        venda.tipo === "Pack Família"
                          ? "#fff8e1"
                          : venda.tipo.includes("Azul")
                          ? "#e3f2fd"
                          : undefined,
                    }}
                  >
                    <TableCell>{venda.numero}</TableCell>
                    <TableCell>{venda.tipo}</TableCell>
                    <TableCell>{formatMoney(venda.preco)}</TableCell>
                    <TableCell>{venda.hora}</TableCell>
                    <TableCell>{venda.operador || "-"}</TableCell>
                    <TableCell>
                      <Tooltip title="Anular">
                        <IconButton
                          onClick={() => anularVenda(venda)}
                          size="small"
                          color="error"
                          disabled={operador?.perfil !== "admin"}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
    </Grow>
  );
}
