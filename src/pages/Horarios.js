import React, { useEffect, useState } from "react";
import {
  Typography, Table, TableHead, TableRow, TableCell,Chip,
  TableBody, Stack, IconButton, TextField, MenuItem, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Tooltip, Box, Divider,
  Card, CardContent
} from "@mui/material";
import { db } from "../firebase";
import {
  collection, query, where, orderBy, onSnapshot,
  setDoc, doc, addDoc, deleteDoc, getDocs
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import ClearAllRoundedIcon from "@mui/icons-material/ClearAllRounded";
import { format, addDays, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';


export default function Horarios({ operador, utilizadores }) {
  const [turnos, setTurnos] = useState([]);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [editDia, setEditDia] = useState(null);
  const [novoTurno, setNovoTurno] = useState({
    manha: [],
    meioturno: [],
    tarde: [],
  });
  const [feriados, setFeriados] = useState([]);
  const [ferias, setFerias] = useState([]);
  const [inicioFerias, setInicioFerias] = useState(null);
  const [fimFerias, setFimFerias] = useState(null);
  const [colabFerias, setColabFerias] = useState("");

  const [folgas, setFolgas] = useState([]);
  const [dataFolga, setDataFolga] = useState(null);
  const [colabFolga, setColabFolga] = useState("");

  useEffect(() => {
    const inicio = format(startOfMonth(mesAtual), "yyyy-MM-dd");
    const fim = format(endOfMonth(mesAtual), "yyyy-MM-dd");
    const q = query(
      collection(db, "turnos"),
      where("data", ">=", inicio),
      where("data", "<=", fim),
      orderBy("data")
    );
    const unsub = onSnapshot(q, (snap) => {
      setTurnos(snap.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, [mesAtual]);

  const diasNoMes = [];
  let d = startOfMonth(mesAtual);
  const fimD = endOfMonth(mesAtual);
  while (d <= fimD) {
    diasNoMes.push(format(d, "yyyy-MM-dd"));
    d = addDays(d, 1);
  }

  useEffect(() => {
    async function fetchFeriados() {
      try {
        const ano = mesAtual.getFullYear();
        const resp = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${ano}/PT`);
        const data = await resp.json();
        const feriadosMes = data
          .map(f => f.date)
          .filter(date => date.slice(0, 7) === format(mesAtual, "yyyy-MM"));
        setFeriados(feriadosMes);
      } catch (e) {
        setFeriados([]);
      }
    }
    fetchFeriados();
  }, [mesAtual]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "ferias"), (snap) => {
      setFerias(snap.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "folgas"), (snap) => {
      setFolgas(snap.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  async function adicionarFerias() {
    if (!colabFerias || !inicioFerias || !fimFerias)
      return alert("Preenche colaborador e datas.");
    await addDoc(collection(db, "ferias"), {
      colaborador: colabFerias,
      inicio: format(inicioFerias, "yyyy-MM-dd"),
      fim: format(fimFerias, "yyyy-MM-dd"),
    });
    setColabFerias(""); setInicioFerias(null); setFimFerias(null);
    alert("Férias registadas!");
  }

  async function adicionarFolga() {
    if (!colabFolga || !dataFolga) return alert("Preenche colaborador e data.");
    await addDoc(collection(db, "folgas"), {
      colaborador: colabFolga,
      data: dataFolga,
    });
    setColabFolga(""); setDataFolga("");
    alert("Folga registada!");
  }

  function abrirEdicao(dia) {
    const t = turnos.find(t => t.data === dia) || {};
    setNovoTurno({
      manha: Array.isArray(t.manha) ? t.manha : t.manha ? [t.manha] : [],
      meioturno: Array.isArray(t.meioturno) ? t.meioturno : t.meioturno ? [t.meioturno] : [],
      tarde: Array.isArray(t.tarde) ? t.tarde : t.tarde ? [t.tarde] : [],
    });
    setEditDia(dia);
  }

  async function gravarEdicao() {
    if (!editDia) return;
    await setDoc(doc(db, "turnos", editDia), {
      data: editDia,
      manha: novoTurno.manha,
      meioturno: novoTurno.meioturno,
      tarde: novoTurno.tarde,
    });
    setEditDia(null);
  }

  const corDoUtilizador = (nome) =>
    utilizadores.find((u) => u.nome === nome)?.cor || "#90caf9";

  function TurnoCell({ nomes, dia }) {
    const arrNomes = Array.isArray(nomes) ? nomes : nomes ? [nomes] : [];
    if (!arrNomes.length) return "-";
  
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {arrNomes.map(n => {
          const emFerias = ferias.some(f => f.colaborador === n && dia >= f.inicio && dia <= f.fim);
          const emFolga = folgas.some(f => f.colaborador === n && f.data === dia);
  
          if (emFerias) {
            // Se está escalado para o turno MAS está de férias, podes exibir com opacidade, riscado, ou badge "de férias"
            return (
              <Box
                key={`${n}-ferias-${dia}`}
                sx={{
                  bgcolor: "#ffb74d",
                  color: "#fff",
                  borderRadius: 9,
                  px: 1.1,
                  mr: 0.4,
                  fontWeight: 700,
                  fontSize: "11px",
                  height: 22,
                  opacity: 0.57,
                  textDecoration: 'line-through',
                  display: "flex",
                  alignItems: "center"
                }}
                title="De férias"
              >
                {n}
              </Box>
            );
          }
          if (emFolga) {
            // Se está de folga, mesmo estando escalado, mostra menor destaque
            return (
              <Box
                key={`${n}-folga-${dia}`}
                sx={{
                  bgcolor: "#b0bec5",
                  color: "#263238",
                  borderRadius: 9,
                  px: 1.1,
                  mr: 0.4,
                  fontWeight: 700,
                  fontSize: "11px",
                  height: 22,
                  opacity: 0.57,
                  textDecoration: 'line-through',
                  display: "flex",
                  alignItems: "center"
                }}
                title="Folga"
              >
                {n}
              </Box>
            );
          }
          // Presença normal
          return (
            <Box
              key={n}
              sx={{
                bgcolor: corDoUtilizador(n),
                color: "#fff",
                borderRadius: 9,
                px: 1.1,
                mr: 0.4,
                fontWeight: 500,
                fontSize: "11px",
                height: 22,
                display: "flex",
                alignItems: "center"
              }}
            >
              {n}
            </Box>
          );
        })}
      </Box>
    );
  }
  
  

  return (
    <Box sx={{
      bgcolor: "#f4f6f8",
      minHeight: "100vh",
      py: { xs: 2, md: 4 }
    }}>
      <Card sx={{ maxWidth: 1200, mx: "auto", mb: 3, boxShadow: 3, borderRadius: 4 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <Typography variant="h4" sx={{ flex: 1, fontWeight: 700, letterSpacing: 1 }}>
              Horários por Turno — {format(mesAtual, "MMMM yyyy")}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setMesAtual(subMonths(mesAtual, 1))}
              sx={{ minWidth: 44, fontWeight: 600 }}
            >←</Button>
            <Button
              variant="outlined"
              onClick={() => setMesAtual(addMonths(mesAtual, 1))}
              sx={{ minWidth: 44, fontWeight: 600 }}
            >→</Button>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Table size="small" sx={{
            mt: 2, minWidth: 800, background: "#fcfcfc", borderRadius: 2, fontSize: 16
          }}>
            <TableHead>
              <TableRow sx={{ background: "#e3f2fd" }}>
                <TableCell sx={{ fontWeight: 700 }}>Dia</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Manhã</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Meio Turno</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tarde</TableCell>
                {operador?.perfil === "admin" && (
                  <TableCell sx={{ fontWeight: 700 }}>Editar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {diasNoMes.map((dia) => {
                const t = turnos.find(t => t.data === dia) || {};
                const feriado = feriados.includes(dia);
                const diaDaSemana = new Date(dia).getDay();
                return (
                  <TableRow
                    key={dia}
                    sx={{
                      background: feriado
                        ? "#fff7df"
                        : [0, 6].includes(diaDaSemana)
                          ? "#e3f2fd"
                          : "white",
                      fontWeight: feriado ? 700 : undefined
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {format(new Date(dia), "dd/MM")}
                      {feriado && (
                        <Tooltip title="Feriado Nacional">
                          <HolidayVillageIcon
                            sx={{ fontSize: 20, color: "#ffb300", ml: 1, mb: "-3px" }}
                          />
                        </Tooltip>
                      )}
                      {/* Férias nesse dia */}
  {ferias
    .filter(f => dia >= f.inicio && dia <= f.fim)
    .map(f => (
      <Tooltip title={`Férias de ${f.colaborador}`} key={`ferias-${f.colaborador}-${dia}`}>
        <Chip
          size="small"
          label="Férias"
          sx={{
            ml: 0.5, bgcolor: "#ffb74d", color: "#fff", fontSize: 10, height: 18
          }}
        />
      </Tooltip>
    ))}

  {/* Folgas nesse dia */}
  {folgas
    .filter(f => f.data === dia)
    .map(f => (
      <Tooltip title={`Folga de ${f.colaborador}`} key={`folga-${f.colaborador}-${dia}`}>
        <Chip
          size="small"
          label="Folga"
          sx={{
            ml: 0.3, bgcolor: "#b0bec5", color: "#263238", fontSize: 10, height: 18
          }}
        />
      </Tooltip>
    ))}
    {operador?.perfil === "admin" && (
  <>
    {ferias
      .filter(f => dia >= f.inicio && dia <= f.fim)
      .map(f => (
        <Tooltip title={`Eliminar férias de ${f.colaborador}`} key={`delferias-${f.colaborador}-${dia}`}>
          <IconButton
            size="small"
            onClick={async () => {
              // Encontra e apaga todas as férias deste colaborador que incluam este dia
              const snap = await getDocs(
                query(
                  collection(db, "ferias"),
                  where("colaborador", "==", f.colaborador),
                  where("inicio", "<=", dia),
                  where("fim", ">=", dia)
                )
              );
              snap.forEach(docSnap => {
                deleteDoc(doc(db, "ferias", docSnap.id));
              });
            }}
            sx={{ ml: 0.2 }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      ))}

    {folgas
      .filter(f => f.data === dia)
      .map(f => (
        <Tooltip title={`Eliminar folga de ${f.colaborador}`} key={`delfolga-${f.colaborador}-${dia}`}>
          <IconButton
            size="small"
            onClick={async () => {
              const snap = await getDocs(
                query(
                  collection(db, "folgas"),
                  where("colaborador", "==", f.colaborador),
                  where("data", "==", dia)
                )
              );
              snap.forEach(docSnap => {
                deleteDoc(doc(db, "folgas", docSnap.id));
              });
            }}
            sx={{ ml: 0.2 }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      ))}
  </>
)}
                    </TableCell>
                    <TableCell>
                      <TurnoCell nomes={t.manha} dia={dia} />
                    </TableCell>
                    <TableCell>
                      <TurnoCell nomes={t.meioturno} dia={dia} />
                    </TableCell>
                    <TableCell>
                      <TurnoCell nomes={t.tarde} dia={dia} />
                    </TableCell>
                    {operador?.perfil === "admin" && (
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => abrirEdicao(dia)}
                          sx={{ color: "#1976d2" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {operador?.perfil === "admin" && (
        <Card sx={{ maxWidth: 600, mx: "auto", p: 3, boxShadow: 2, borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Registar Férias</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <DatePicker
                  label="Início"
                  value={inicioFerias}
                  onChange={(newValue) => setInicioFerias(newValue)}
                />
                <DatePicker
                  label="Fim"
                  value={fimFerias}
                  onChange={(newValue) => setFimFerias(newValue)}
                />
              </Stack>
            </LocalizationProvider>
            <TextField
              select
              label="Colaborador"
              value={colabFerias}
              onChange={(e) => setColabFerias(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              {utilizadores.map((u) => (
                <MenuItem key={u.nome} value={u.nome}>
                  {u.nome}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ fontWeight: 600, mb: 1 }}
              onClick={adicionarFerias}
            >
              Registar Férias
            </Button>

            <Divider sx={{ my: 2 }}>Ou</Divider>

            <Typography variant="h6" sx={{ mb: 2 }}>Registar Folga</Typography>
            <TextField
              label="Data"
              type="date"
              value={dataFolga || ""}
              onChange={(e) => setDataFolga(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Colaborador"
              value={colabFolga}
              onChange={(e) => setColabFolga(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              {utilizadores.map((u) => (
                <MenuItem key={u.nome} value={u.nome}>
                  {u.nome}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontWeight: 600 }}
              onClick={adicionarFolga}
            >
              Registar Folga
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={Boolean(editDia)} onClose={() => setEditDia(null)}>
        <DialogTitle>
          Editar turnos para <b>{editDia && format(new Date(editDia), "dd/MM/yyyy")}</b>
        </DialogTitle>
        <DialogContent sx={{ minWidth: 330 }}>
          <Stack spacing={3} mt={1}>
            {["manha", "meioturno", "tarde"].map((turno) => (
              <Box key={turno} sx={{ mb: 1 }}>
                <TextField
                  select
                  label={turno[0].toUpperCase() + turno.slice(1)}
                  fullWidth
                  value={novoTurno[turno] || []}
                  onChange={(e) =>
                    setNovoTurno((nt) => ({
                      ...nt,
                      [turno]: Array.isArray(e.target.value) ? e.target.value : [],
                    }))
                  }
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      selected.length ? selected.join(", ") : "— Nenhum —",
                  }}
                  sx={{ background: "#f9fbe7", borderRadius: 1 }}
                >
                  {utilizadores.map((u) => (
                    <MenuItem key={u.nome} value={u.nome}>
                      <span
                        style={{
                          background: u.cor,
                          color: "#fff",
                          borderRadius: 6,
                          padding: "2px 6px",
                          marginRight: 7,
                          fontWeight: 500,
                          fontSize: 13,
                          display: "inline-block",
                        }}
                      >
                        {u.nome}
                      </span>
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  startIcon={<ClearAllRoundedIcon />}
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    paddingY: 0.8,
                    letterSpacing: 0.4,
                  }}
                  onClick={() =>
                    setNovoTurno((nt) => ({
                      ...nt,
                      [turno]: [],
                    }))
                  }
                >
                  Limpar {turno[0].toUpperCase() + turno.slice(1)}
                </Button>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDia(null)}>Cancelar</Button>
          <Button variant="contained" onClick={gravarEdicao}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
