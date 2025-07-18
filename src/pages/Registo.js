import React from "react";
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
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatMoney } from "../utils/helpers";
import AddIcon from '@mui/icons-material/Add';
import Grow from "@mui/material/Grow";
import { useState } from "react";




export default function Registo({
  vendas,
  numeroAtual,
  setNumeroAtual,
  primeiroNumero,
  setPrimeiroNumero,
  setVendas,
  setTotalVendas,
  totalVendas,
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
  anularVenda,
  exportarCSV,
  exportarPDF,
  venderAzul,
}) 

{ 

  function iniciar() {
    setVendas([]);
    setNumeroAtual(primeiroNumero);
    setTotalVendas(0);
    setInputBloqueado(true);
  }
  <Paper elevation={3} sx={{ maxWidth: 900, mx: "auto", p: 4, borderRadius: 5, bgcolor: "#fff" }}>
  <Typography variant="h4" color="primary" fontWeight={600} mb={2}>
    Registo de Pulseiras
  </Typography>
  <Divider sx={{ my: 3 }} />
  {/* Resto dos campos e botões */}
</Paper>
const [numeroAzul, setNumeroAzul] = useState("");
  return (
      <Grow in={true} timeout={650}>
    <Paper elevation={4} sx={{ maxWidth: 1800, mx: "auto", p: 4, borderRadius: 5, mt: 3, mb: 2, bgcolor: "#fff" }}>
    <div>
      <Box sx={{mb:2}}>
        {!operador && (
          <Typography color="error">
            Por favor autentique-se para abrir um turno.
          </Typography>
        )}
        {operador && !turnoAberto && (
          <Button onClick={abrirTurno} startIcon={<AddIcon />} variant="contained" color="primary" sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }}>
            Abrir Turno
          </Button>
        )}
        {turnoAberto && (
          <Button onClick={fecharTurno} startIcon={<AddIcon />} variant="contained" color="primary" sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }}>
            Fechar Turno
          </Button>
        )}
        {horaAbertura && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Turno iniciado às {horaAbertura.toLocaleTimeString("pt-PT")}
          </Typography>
        )}
      </Box>
      
      {!inputBloqueado && (
        <Stack direction="row" spacing={2} mb={3}>
          <TextField
            label="Primeiro Nº de Pulseira"
            type="number"
            value={primeiroNumero}
            onChange={(e) => setPrimeiroNumero(Number(e.target.value))}
          />
          <Button onClick={iniciar} startIcon={<AddIcon />} variant="contained" color="primary" sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }}>
            Iniciar Vendas
          </Button>
        </Stack>
      )}

      {inputBloqueado && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mb={3}>
          <Button onClick={() => vender("adulto")} startIcon={<AddIcon />} variant="contained" color="primary" sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }} disabled={!turnoAberto}>
            Vender Pulseira Adulto (F1)
          </Button>
          <Button
            onClick={() => vender("menor")}
            startIcon={<AddIcon />}
            color="primary"
            variant="contained"
            sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }}
            disabled={!turnoAberto}
          >
            Vender Pulseira Menor (F2)
          </Button>
          <Button
            onClick={() => vender("pack")}
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }}
            color="warning"
            disabled={!turnoAberto}
          >
            Pack Família (F3)
          </Button>
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
         <Stack
  direction={{ xs: "column", sm: "row" }} // coluna em mobile, linha em desktop/tablet
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
      width: { xs: "100%", sm: 160 }, /* ocupa toda a largura em XS/mobile */
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
    disabled={!turnoAberto || !operador || !venderAzul}
    sx={{
      fontWeight: 600,
      width: { xs: "100%", sm: "auto" }, // botão largo em mobile, clássico em desktop
    }}
  >
    Vender Pulseira Azul
  </Button>
</Stack>

          <Button onClick={exportarCSV} startIcon={<AddIcon />} variant="outlined" color="primary" size="small" sx={{ borderRadius: 8, minWidth: 180, fontWeight: 600 }}>
            Exportar CSV
          </Button>
          <Button onClick={() => exportarPDF(vendas)} variant="outlined" size="small">
            Exportar PDF
          </Button>
        </Stack>
      )}
 
      <Typography variant="h6">
        Total vendido: {formatMoney(totalVendas)}
      </Typography>

     <TableContainer component={Paper} sx={{ mt: 2 }}>
  <Table>
    <TableHead>
      <TableRow sx={{ bgcolor: "primary.light" }}>
        <TableCell sx={{ fontWeight: "bold", color: "primary", fontSize: 17 }}>Número</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "primary", fontSize: 17 }}>Tipo</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "primary", fontSize: 17 }}>Valor</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "primary", fontSize: 17 }}>Hora</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "primary", fontSize: 17 }}>Operador</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "primary", fontSize: 17 }}>Anular</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {vendas.map((venda, idx) => (
        <TableRow
          key={idx}
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
                onClick={() => anularVenda(idx)}
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
