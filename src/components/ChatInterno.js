import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Badge,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Stack,
  useTheme,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import SendIcon from "@mui/icons-material/Send";
import {
  collection,
  addDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function ChatInterno({ operador }) {
  const theme = useTheme();
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [novasMensagens, setNovasMensagens] = useState(0);
  const messagesEndRef = useRef(null);

  const nomeAtual = operador?.nome || "visitante";

  // 🔄 Carrega mensagens + recalcula badge
  useEffect(() => {
    const destinos = operador
      ? ["todos", operador.nome, operador.perfil === "admin" ? "admin" : "todos"]
      : ["todos"];

    const q = query(
      collection(db, "chatMensagens"),
      where("destino", "in", destinos),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMensagens(arr);

      const novas = arr.filter(
        (msg) =>
          // Visível ao utilizador
          (msg.destino === nomeAtual || msg.destino === "todos" || (operador?.perfil === "admin" && msg.destino === "admin")) &&
          // Ainda não lida por este utilizador
          (!msg.lidaPor || !msg.lidaPor[nomeAtual]) &&
          // Não foi enviada pelo próprio
          msg.remetente !== nomeAtual
      );

      

      setNovasMensagens(novas.length);
    });

    return unsub;
  }, [chatAberto, operador, nomeAtual]);

  // ✅ Marca como lidas para o utilizador atual
  useEffect(() => {
    if (!chatAberto || mensagens.length === 0) return;

    const marcarComoLidas = async () => {
      const mensagensParaMarcar = mensagens.filter(
        (msg) =>
          (msg.destino === nomeAtual || msg.destino === "todos" || (operador?.perfil === "admin" && msg.destino === "admin")) &&
          (!msg.lidaPor || !msg.lidaPor[nomeAtual]) &&
          msg.remetente !== nomeAtual &&
          msg.id
      );

      for (const msg of mensagensParaMarcar) {
        try {
          await updateDoc(doc(db, "chatMensagens", msg.id), {
            [`lidaPor.${nomeAtual}`]: true,
          });
        } catch (e) {
          console.error("❌ Erro ao marcar como lida:", e.message);
        }
      }
    };

    marcarComoLidas();
  }, [chatAberto, mensagens,operador, nomeAtual]);

  // Scroll automático
  useEffect(() => {
    if (chatAberto) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [chatAberto, mensagens]);

  // ➕ Enviar Mensagem
  async function enviarMensagem(ev) {
    ev?.preventDefault();
    if (!mensagem.trim()) return;

    await addDoc(collection(db, "chatMensagens"), {
      texto: mensagem,
      remetente: nomeAtual,
      destino: operador?.perfil === "admin" ? "todos" : "admin",
      timestamp: new Date(),
      lidaPor: {}, // começa como não lida por ninguém
    });

    setMensagem("");
  }

  return (
    <>
      <Box sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 2000 }}>
        {!chatAberto && (
          <IconButton
            sx={{
              bgcolor: "primary.main",
              color: "white",
              boxShadow: 3,
              width: 62,
              height: 62,
              border: "2px solid",
              borderColor: "primary.dark",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            onClick={() => setChatAberto(true)}
            size="large"
          >
            <Badge
              badgeContent={novasMensagens > 0 ? novasMensagens : null}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  right: -3,
                  top: 3,
                  minWidth: 18,
                  height: 18,
                  fontSize: 13,
                  padding: "0 5px",
                  borderRadius: "50%",
                  fontWeight: 600,
                  boxShadow: "0 0 0 2px #fff",
                },
              }}
            >
              <ForumIcon sx={{ fontSize: 38 }} />
            </Badge>
          </IconButton>
        )}

        {/* Chat flutuante */}
        {chatAberto && (
          <Box
            sx={{
              zIndex: 2,
              width: 420,
              height: 600,
              boxShadow: 6,
              borderRadius: "18px",
              bgcolor: theme.palette.mode === "dark" ? "#181f2a" : "#fefefe",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                color: "#fff",
                bgcolor: "primary.main",
                fontWeight: 600,
                fontSize: 17,
                position: "relative",
              }}
            >
              💬 Mensagens Internas
              <IconButton
                size="small"
                sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}
                onClick={() => setChatAberto(false)}
              >
                ×
              </IconButton>
            </Box>

            {/* Mensagens */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: 2,
                py: 2,
                position: "relative",
                backgroundImage: `url("/bg-chat.png")`,
                backgroundRepeat: "repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(34,38,52,0.75)"
                      : "rgba(255,255,255,0.56)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <List>
                  {mensagens.map((msg) => (
                    <ListItem
                      key={msg.id}
                      disableGutters
                      sx={{
                        display: "flex",
                        justifyContent:
                          msg.remetente === nomeAtual
                            ? "flex-end"
                            : "flex-start",
                        px: 0,
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: 260,
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems:
                            msg.remetente === nomeAtual
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 11,
                            mb: 0.2,
                            color:
                              msg.remetente === nomeAtual
                                ? "primary.main"
                                : "success.dark",
                          }}
                        >
                          {msg.remetente}
                        </Typography>

                        <Box
                          sx={{
                            px: 1.4,
                            pt: 0.8,
                            pb: 0.4,
                            fontSize: 14.5,
                            backgroundColor:
                              msg.remetente === nomeAtual
                                ? "primary.main"
                                : theme.palette.mode === "dark"
                                ? "#2c2c2c"
                                : "#f1f1f1",
                            color:
                              msg.remetente === nomeAtual ? "#fff" : "#000",
                            borderRadius:
                              msg.remetente === nomeAtual
                                ? "12px 12px 2px 12px"
                                : "12px 12px 12px 2px",
                            boxShadow: 1,
                          }}
                        >
                          {msg.texto}
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: "right",
                              opacity: 0.5,
                              fontSize: 10,
                              mt: 0.2,
                            }}
                          >
                            {msg.timestamp?.toDate
                              ? msg.timestamp
                                  .toDate()
                                  .toLocaleTimeString("pt-PT")
                              : ""}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              </Box>
            </Box>

            {/* Input */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #e0e0e0",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "#1e2230"
                    : "background.paper",
              }}
            >
              <form onSubmit={enviarMensagem}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Escreve algo..."
                    fullWidth
                    size="small"
                    sx={{ bgcolor: "#fff", borderRadius: 2 }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) enviarMensagem(e);
                    }}
                  />
                  <Button type="submit" variant="contained">
                    <SendIcon />
                  </Button>
                </Stack>
              </form>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
