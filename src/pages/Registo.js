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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";



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
  venderPromoFamiliar,
  metodoPagamento,
  setMetodoPagamento
}) {
  const [numeroAzul, setNumeroAzul] = useState("");
  const [openPromoFamiliar, setOpenPromoFamiliar] = useState(false);
const [numerosPromo, setNumerosPromo] = useState(["", "", "", ""]);


  function iniciar() {
    setNumeroAtual(primeiroNumero);
    setInputBloqueado(true);
  }

  function labelMetodoPagamento(metodo) {
  if (metodo === "dinheiro") return "💶 Numerário";
  if (metodo === "multibanco") return "💳 Multibanco";
  return "-";
}

  // Anular venda (apaga do Firestore)
  async function anularVenda(venda) {
  // Permitir apagar apenas se o operador atual for o dono da venda
  if (operador?.nome !== venda.operador) {
    return alert("Só podes eliminar as vendas que fizeste.");
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
            {turnoAberto && operador && (
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
              {/* Seleção do método de pagamento */}
            <TextField
              select
              label="Método de Pagamento"
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              size="small"
              sx={{ width: 200 }}
              SelectProps={{ native: true }}
            >
              <option value="dinheiro">💶 Numerário</option>
              <option value="multibanco">💳 Multibanco</option>
            </TextField>
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

              <Button
                onClick={() => setOpenPromoFamiliar(true)}
                startIcon={<AddIcon />}
                variant="contained"
                color="success"
                sx={{ borderRadius: 8, minWidth: 220, fontWeight: 600 }}
                disabled={!turnoAberto}
              >
                Promo Família (4 Pulseiras / F4)
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

           {/* Totais detalhados */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total vendido:
        </Typography>
        <Typography>
          💶 Numerário:{" "}
          {formatMoney(
            vendas
              .filter((v) => v.metodoPagamento === "dinheiro")
              .reduce((a, v) => a + (parseFloat(v.preco) || 0), 0)
          )}
        </Typography>
        <Typography>
          💳 Multibanco:{" "}
          {formatMoney(
            vendas
              .filter((v) => v.metodoPagamento === "multibanco")
              .reduce((a, v) => a + (parseFloat(v.preco) || 0), 0)
          )}
        </Typography>
        <Typography fontWeight={600}>
          💰 Total:{" "}
          {formatMoney(
            vendas.reduce((a, v) => a + (parseFloat(v.preco) || 0), 0)
          )}
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.light" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Número</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Valor</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hora</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Operador</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Método</TableCell>
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
                  <TableCell>{labelMetodoPagamento(venda.metodoPagamento)}</TableCell>
                  <TableCell>
                    <Tooltip title="Anular">
                      <IconButton
                        onClick={() => anularVenda(venda)}
                        size="small"
                        color="error"
                        disabled={venda.operador !== operador?.nome}
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
        <Dialog open={openPromoFamiliar} onClose={() => setOpenPromoFamiliar(false)}>
  <DialogTitle>Promo Família — Números das 4 Pulseiras</DialogTitle>
  <DialogContent>
    <Stack spacing={2} mt={1}>
      {numerosPromo.map((num, idx) => (
        <TextField
          key={idx}
          label={`Nº Pulseira ${idx + 1}`}
          value={num}
          type="number"
          onChange={e => {
            const novo = [...numerosPromo];
            novo[idx] = e.target.value;
            setNumerosPromo(novo);
          }}
          size="small"
        />
      ))}
    </Stack>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenPromoFamiliar(false)}>Cancelar</Button>
    <Button
      onClick={async () => {
        if (numerosPromo.some(n => !n)) {
          alert("Preenche todos os campos.");
          return;
        }
        const data = new Date();
        for (let numero of numerosPromo) {
          await venderPromoFamiliar(Number(numero), data);
        }
        setOpenPromoFamiliar(false);
        setNumerosPromo(["", "", "", ""]);
      }}
      variant="contained"
    >
      Registar 4 Pulseiras
    </Button>
  </DialogActions>
</Dialog>

      </Paper>
    </Grow>
  );
}
