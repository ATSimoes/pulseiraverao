import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function GestaoUtilizadores({ utilizadores, setUtilizadores }) {
  const [novoNome, setNovoNome] = useState("");
  const [novoPin, setNovoPin] = useState("");
  const [novoPerfil, setNovoPerfil] = useState("funcionario");

  function adicionarUtilizador() {
    if (!novoNome || !novoPin) return alert("Preenche todos os campos");
    if (utilizadores.some(u => u.nome === novoNome)) return alert("Nome já existe!");
    const atual = [...utilizadores, { nome: novoNome, pin: novoPin, perfil: novoPerfil }];
    setUtilizadores(atual);
    localStorage.setItem("utilizadores", JSON.stringify(atual));
    setNovoNome(""); setNovoPin("");
    alert("Utilizador criado.");
  }

  function apagarUtilizador(nome) {
    if (!window.confirm("Eliminar utilizador?")) return;
    const atual = utilizadores.filter(u => u.nome !== nome);
    setUtilizadores(atual);
    localStorage.setItem("utilizadores", JSON.stringify(atual));
  }

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography variant="h6" mb={2}>Gestão de Utilizadores</Typography>
      <TextField label="Nome" value={novoNome} onChange={e => setNovoNome(e.target.value)} sx={{ mb:1, width:"100%" }} />
      <TextField label="PIN" value={novoPin} type="password" onChange={e => setNovoPin(e.target.value)} sx={{ mb:1, width:"100%" }} />
      <TextField select label="Perfil" value={novoPerfil} onChange={e => setNovoPerfil(e.target.value)} sx={{ mb:2, width:"100%" }} SelectProps={{ native: true }}>
        <option value="funcionario">Funcionário</option>
        <option value="admin">Admin</option>
      </TextField>
      <Button onClick={adicionarUtilizador} variant="contained" fullWidth>Criar Utilizador</Button>
      <Typography variant="subtitle1" mt={3} mb={1}>Lista de Utilizadores</Typography>
      {utilizadores.map(u =>
        <Box key={u.nome} sx={{ display:"flex", alignItems:"center", mt:1 }}>
          <Typography>{u.nome} ({u.perfil})</Typography>
          <Button
            onClick={() => apagarUtilizador(u.nome)}
            variant="text"
            color="error"
            size="small"
            sx={{ ml:2 }}
            disabled={u.perfil === "admin" && u.nome === "admin"} // Protege admin
          >Apagar</Button>
        </Box>
      )}
    </Box>
  );
}
