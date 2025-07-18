import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function GestaoUtilizadores({ utilizadores }) {
  const [novoNome, setNovoNome] = useState("");
  const [novoPin, setNovoPin] = useState("");
  const [novoPerfil, setNovoPerfil] = useState("funcionario");

  async function adicionarUtilizador() {
    if (!novoNome || !novoPin) {
      alert("Preenche todos os campos");
      return;
    }

    if (utilizadores.some(u => u.nome === novoNome)) {
      alert("Nome já existe!");
      return;
    }

    try {
      await addDoc(collection(db, "utilizadores"), {
        nome: novoNome,
        pin: novoPin,
        perfil: novoPerfil
      });
      setNovoNome("");
      setNovoPin("");
      alert("Utilizador criado com sucesso.");
    } catch (error) {
      console.error("Erro ao criar utilizador: ", error);
      alert("Erro ao criar utilizador.");
    }
  }

  async function apagarUtilizador(user) {
    if (!window.confirm("Eliminar utilizador?")) return;

    try {
      const ref = doc(db, "utilizadores", user.id);
      await deleteDoc(ref);
    } catch (error) {
      console.error("Erro ao apagar utilizador: ", error);
      alert("Erro ao apagar utilizador.");
    }
  }

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography variant="h6" mb={2}>Gestão de Utilizadores</Typography>

      <TextField
        label="Nome"
        value={novoNome}
        onChange={e => setNovoNome(e.target.value)}
        sx={{ mb: 1, width: "100%" }}
      />

      <TextField
        label="PIN"
        value={novoPin}
        type="password"
        onChange={e => setNovoPin(e.target.value)}
        sx={{ mb: 1, width: "100%" }}
      />

      <TextField
        select
        label="Perfil"
        value={novoPerfil}
        onChange={e => setNovoPerfil(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
        SelectProps={{ native: true }}
      >
        <option value="funcionario">Funcionário</option>
        <option value="admin">Admin</option>
      </TextField>

      <Button
        onClick={adicionarUtilizador}
        variant="contained"
        fullWidth
      >
        Criar Utilizador
      </Button>

      <Typography variant="subtitle1" mt={3} mb={1}>
        Lista de Utilizadores
      </Typography>

      {utilizadores.map(u =>
        <Box key={u.id} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Typography>{u.nome} ({u.perfil})</Typography>
          <Button
            onClick={() => apagarUtilizador(u)}
            variant="text"
            color="error"
            size="small"
            sx={{ ml: 2 }}
            disabled={u.perfil === "admin" && u.nome === "admin"} // Protege admin
          >
            Apagar
          </Button>
        </Box>
      )}
    </Box>
  );
}
