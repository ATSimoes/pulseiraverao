// src/components/AlertaTempoReal.js

import React, { useEffect, useState } from "react";
import { Alert, Collapse, IconButton, Box, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where
} from "firebase/firestore";
import { db } from "../firebase";

export default function AlertaTempoReal({ operador }) {
  const [alerta, setAlerta] = useState(null);
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    if (!operador) return;

    const q = query(
      collection(db, "alertas"),
      where("ativo", "==", true),
      orderBy("data", "desc"),
      limit(1)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const novoAlerta = snap.docs[0].data();
        const ultimaMensagemFechada = localStorage.getItem("alertaFechado");
        // Só mostra se for diferente do atual
        if (novoAlerta.mensagem !== ultimaMensagemFechada) {
          setAlerta(novoAlerta);
          setVisivel(true);
        }else {
          setAlerta(null);
          setVisivel(false);
      }
    }
    });

    return () => unsub();
  }, [operador, alerta]);

  const handleFechar = () => {
   if (alerta) {
    localStorage.setItem("alertaFechado", alerta.mensagem);
   }
    setVisivel(false);
  };

  // Mapeia tipo → cor
  const tipoParaSeveridade = (tipo) => {
    switch (tipo) {
      case "erro":
        return "error";
      case "aviso":
        return "warning";
      case "sucesso":
        return "success";
      default:
        return "info";
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 80,
        right: 20,
        zIndex: 9999,
        width: { xs: "90%", sm: 360 },
        maxWidth: "100%",
      }}
    >
      <Slide direction="down" in={visivel} mountOnEnter unmountOnExit>
        <Collapse in={visivel}>
          {alerta && (
            <Alert
              severity={tipoParaSeveridade(alerta.tipo)}
              action={
                <IconButton
                  aria-label="fechar"
                  size="small"
                  onClick={handleFechar}
                  color="inherit"
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                borderRadius: 2,
                boxShadow: 4,
                fontSize: 15,
                fontWeight: 500,
                alignItems: "center",
              }}
            >
              {alerta.mensagem}
            </Alert>
          )}
        </Collapse>
      </Slide>
    </Box>
  );
}
