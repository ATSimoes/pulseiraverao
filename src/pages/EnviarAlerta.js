import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function EnviarAlerta() {
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("info");

  async function enviar() {
    if (!mensagem.trim()) return alert("Escreve uma mensagem");

    try {
      await addDoc(collection(db, "alertas"), {
        mensagem,
        tipo, // campo importante
        data: serverTimestamp(),
        ativo: true,
      });
      setMensagem("");
      setTipo("info");
      alert("Mensagem enviada com sucesso!");
    } catch (err) {
      alert("Erro ao enviar:", err.message);
    }
  }

  return (
    <Paper sx={{ maxWidth: 600, mx: "auto", my: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Enviar Alerta para a Receção
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="Tipo de Alerta"
          select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <MenuItem value="info">ℹ️ Informação</MenuItem>
          <MenuItem value="sucesso">✅ Sucesso</MenuItem>
          <MenuItem value="aviso">⚠️ Aviso</MenuItem>
          <MenuItem value="erro">❌ Erro</MenuItem>
        </TextField>
        <Button variant="contained" onClick={enviar}>
          Enviar Alerta
        </Button>
      </Stack>
    </Paper>
  );
}
