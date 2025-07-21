import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuTopo from "./components/MenuTopo";
import Registo from "./pages/Registo";
import Historico from "./pages/Historico";
import Menu from "./pages/Menu";
import GestaoUtilizadores from "./pages/GestaoUtilizadores";
import Estatisticas from "./pages/Estatisticas";
import Fade from "@mui/material/Fade";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Chip from "@mui/material/Chip";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import { dataHoje, obterPreco } from "./utils/helpers";
import AdminVendas from "./pages/AdminVendas";
<<<<<<< HEAD
import AlertaTempoReal from "./components/AlertaTempoReal";
import EnviarAlerta from "./pages/EnviarAlerta";
import Horarios from "./pages/Horarios";

=======
>>>>>>> f134ee1e8e2f5a7685ec1624f05c6d4ad212b7f7

export default function App() {
  // Página atual
  const [paginaAtual, setPaginaAtual] = useState(() =>
    localStorage.getItem("paginaAtual") || "menu"
  );
  useEffect(() => {
    localStorage.setItem("paginaAtual", paginaAtual);
  }, [paginaAtual]);

  // Operador
  const [operador, setOperador] = useState(() => {
    const armazenado = localStorage.getItem("operador");
    return armazenado ? JSON.parse(armazenado) : null;
  });
  const [loginNome, setLoginNome] = useState("");
  const [loginPin, setLoginPin] = useState("");

  // Utilizadores Firebase
  const [utilizadores, setUtilizadores] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "utilizadores"),
      (snapshot) => {
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUtilizadores(lista);
      }
    );
    return () => unsubscribe();
  }, []);

  // Criar novo utilizador
  async function criarUtilizador(utilizador) {
    try {
      await addDoc(collection(db, "utilizadores"), utilizador);
    } catch (err) {
      alert("Erro ao criar utilizador.");
    }
  }

  // Login
  function loginOperador() {
    const user = utilizadores.find(
      u => u.nome === loginNome && u.pin === loginPin
    );
    if (user) {
      setOperador(user);
      localStorage.setItem("operador", JSON.stringify(user));
      setLoginNome("");
      setLoginPin("");
    } else {
      alert("Credenciais inválidas.");
    }
  }

  // Logout
  function logout() {
    setOperador(null);
    localStorage.removeItem("operador");
  }

  // Turno
  const [turnoAberto, setTurnoAberto] = useState(() =>
    JSON.parse(localStorage.getItem("turnoAberto")) || false
  );
  const [horaAbertura, setHoraAbertura] = useState(() =>
    localStorage.getItem("horaAbertura")
      ? new Date(localStorage.getItem("horaAbertura"))
      : null
  );

  useEffect(() => {
    localStorage.setItem("turnoAberto", JSON.stringify(turnoAberto));
  }, [turnoAberto]);

  useEffect(() => {
    if (horaAbertura) {
      localStorage.setItem("horaAbertura", horaAbertura.toISOString());
    } else {
      localStorage.removeItem("horaAbertura");
    }
  }, [horaAbertura]);

  function abrirTurno() {
    if (!operador) return alert("Autentica-te para abrir turno.");
    setTurnoAberto(true);
    setInputBloqueado(true);
    const agora = new Date();
    setHoraAbertura(agora);
  }

  function fecharTurno() {
    setTurnoAberto(false);
    setHoraAbertura(null);
    setInputBloqueado(false);
  }

  useEffect(() => {
  if (operador && turnoAberto) {
    setInputBloqueado(true);
  }
<<<<<<< HEAD
  
=======
>>>>>>> f134ee1e8e2f5a7685ec1624f05c6d4ad212b7f7
}, [operador, turnoAberto]);
  // ======== VENDAS (Firestore) ========
  const [vendas, setVendas] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);
  const [numeroAtual, setNumeroAtual] = useState(1);
  const [primeiroNumero, setPrimeiroNumero] = useState(1);
  const [novoNumero, setNovoNumero] = useState("");
  const [inputBloqueado, setInputBloqueado] = useState(false);

  // Sincronizar vendas Firestore em tempo real
  useEffect(() => {
    if (!turnoAberto) {
      setVendas([]);
      setTotalVendas(0);
      setNumeroAtual(primeiroNumero);
      return;
    }
    // Query vendas do dia corrente. Podes ajustar para mostrar vendas globais
    const hojeISO = new Date().toISOString().slice(0, 10); // AAAA-MM-DD

    const q = query(
      collection(db, "vendas"),
      where("operador", "==", operador?.nome || ""),
      where("dataISO", ">=", `${hojeISO}T00:00:00`),
      where("dataISO", "<=", `${hojeISO}T23:59:59`),
      orderBy("dataISO", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filtrar por data se só quiseres deste turno/dataHoje()
      // Exemplo: lista.filter(v => v.dataISO.startsWith(dataHojeISO))
      setVendas(lista);
      setTotalVendas(
        lista.reduce((s, venda) => s + (parseFloat(venda.preco) || 0), 0)
      );
    });
    return unsubscribe;
  }, [turnoAberto, primeiroNumero, operador]);
  
  // Função para guardar venda no Firestore
  async function registarVendaFirestore(venda) {
    try {
      await addDoc(collection(db, "vendas"), venda);
    } catch (error) {
      alert("ERRO AO GUARDAR VENDA: " + error.message);
    }
  }

  // Vender vários tipos
  const vender = useCallback(
    async (tipo) => {
      if (!operador || !turnoAberto) return;
      const data = new Date();
       // Promo Família Sáb e Dom: 4 pulseiras = 10€
    if (tipo === "promo_familiar") {
      const diaSemana = data.getDay(); // 0=Dom, 6=Sáb
      if (diaSemana === 0 || diaSemana === 6) {
        const novaVenda = {
          numero: numeroAtual,
          tipo: "Promo Família (4 Pulseiras)",
          preco: 10,
          hora: data.toLocaleTimeString("pt-PT"),
          operador: operador.nome,
          dataISO: data.toISOString(),
        };
        await registarVendaFirestore(novaVenda);
        setNumeroAtual(n => n + 4); // Incrementa logo 4 pulseiras (opcional)
      } else {
        alert("Promoção só disponível ao sábado e domingo!");
      }
      return;
    }
      const preco = tipo === "pack" ? 0 : obterPreco(tipo, data);
      const novaVenda = {
        numero: numeroAtual,
        tipo: tipo === "pack"
          ? "Pack Família"
          : tipo.charAt(0).toUpperCase() + tipo.slice(1),
        preco,
        hora: data.toLocaleTimeString("pt-PT"),
        operador: operador ? operador.nome : "-",
        dataISO: data.toISOString(),
      };
      await registarVendaFirestore(novaVenda);
      setNumeroAtual(n => n + 1);
    },
    [numeroAtual, operador, turnoAberto]
  );

  // Vender pulseira azul (número manual)
  async function venderAzul(numeroManual) {
    if (!operador || !turnoAberto) return;
    const data = new Date();
    const novaVenda = {
      numero: numeroManual,
      tipo: "Azul (Piscina Interior)",
      preco: 1.6,
      hora: data.toLocaleTimeString("pt-PT"),
      operador: operador?.nome || "-",
      dataISO: data.toISOString(),
    };
    await registarVendaFirestore(novaVenda);
  }

  async function venderPromoFamiliar(numero, data) {
    const diaSemana = data.getDay(); // 0 = Domingo, 6 = Sábado
    if (diaSemana !== 6 && diaSemana !== 0) {
      alert("Promoção só disponível ao sábado e domingo!");
      return;
    }
  
    const novaVenda = {
      numero,
      tipo: "Promo Família (4 Pulseiras)",
      preco: 2.5,
      hora: data.toLocaleTimeString("pt-PT"),
      operador: operador?.nome || "-",
      dataISO: data.toISOString(),
    };
  
    await registarVendaFirestore(novaVenda);
  }
  

  // Atalhos Teclado (F1/F2/F3)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!inputBloqueado || paginaAtual !== "registo" || !turnoAberto || !operador) return;
      if (e.key === "F1") { e.preventDefault(); vender("adulto"); }
      if (e.key === "F2") { e.preventDefault(); vender("menor"); }
      if (e.key === "F3") { e.preventDefault(); vender("pack"); }
      if (e.key === "F4") { e.preventDefault(); vender("promo_familiar"); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputBloqueado, paginaAtual, vender, operador, turnoAberto]);

  // Anular venda (Atenção: eliminação em Firestore só se implementares)
  async function anularVenda(idx) {
    alert("Funcionalidade 'anular venda' ainda não elimina no Firestore. Recomenda-se criar uma flag 'anulada' ou guardar o ID no Firestore se quiseres eliminar também na cloud.");
  }

  // ------------------- EXPORTAÇÃO CSV/PDF -------------------
  const exportarCSV = () => {
    let csv = "Número,Tipo,Valor,Hora,Operador\n";
    vendas.forEach(v => {
      csv += `${v.numero},${v.tipo},${v.preco},${v.hora},${v.operador || "-"}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendas_${dataHoje()}.csv`;
    a.click();
  };

  function exportarPDF() {
    Promise.all([import("jspdf"), import("jspdf-autotable")]).then(
      ([jsPDFModule, autoTableModule]) => {
        const jsPDF = jsPDFModule.default;
        const autoTable = autoTableModule.default;

        const doc = new jsPDF();
        doc.text("Relatório de Vendas de Pulseiras", 10, 10);
        autoTable(doc, {
          startY: 20,
          head: [["Número", "Tipo", "Valor", "Hora", "Operador"]],
          body: vendas.map(v => [
            v.numero,
            v.tipo,
            v.preco,
            v.hora,
            v.operador || "-"
          ])
        });
        doc.save(`vendas_${dataHoje()}.pdf`);
      }
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {!operador ? (
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              bgcolor: "#fff3e0",
              p: 3,
              mt: 6,
              borderRadius: 2,
              maxWidth: 400,
              mx: "auto",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" mb={1}>Autenticação</Typography>
            <select
              value={loginNome}
              onChange={e => setLoginNome(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "12px",
                padding: 8,
                borderRadius: 4
              }}
            >
              <option value="">Selecione utilizador</option>
              {utilizadores.map(u => (
                <option key={u.nome} value={u.nome}>{u.nome}</option>
              ))}
            </select>
            <input
              value={loginPin}
              onChange={e => setLoginPin(e.target.value)}
              type="password"
              placeholder="PIN"
              style={{
                width: "100%",
                marginBottom: "12px",
                padding: 8,
                borderRadius: 4
              }}
              maxLength={6}
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={loginOperador}
            >
              Entrar
            </Button>
          </Box>
        </Fade>
      ) : (
        <>
          {/* Menu Topo */}
          <MenuTopo
            paginaAtual={paginaAtual}
            setPaginaAtual={setPaginaAtual}
            isAdmin={operador?.perfil === "admin"}
          />

            {/* ALERTAS EM TEMPO REAL */}
            <AlertaTempoReal operador={operador} />
  
          {/* Cartão do Operador Logado */}
          <Card
            elevation={3}
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: 420,
              mx: "auto",
              my: 3,
              px: 3,
              py: 2,
              bgcolor: "#fff",
              borderRadius: 4,
              boxShadow: 4,
              gap: 2
            }}
          >
            <Avatar
              sx={{
                width: 54,
                height: 54,
                bgcolor: operador.perfil === "admin" ? "primary.main" : "success.main",
                mr: 2
              }}
            >
              <PersonIcon sx={{ fontSize: 36, color: "#fff" }} />
            </Avatar>
            <CardContent sx={{ flex: 1, p: 0 }}>
              <strong style={{ fontSize: 17 }}>{operador.nome}</strong><br />
              <Chip
                label={operador.perfil === "admin" ? "Admin" : "Funcionário"}
                color={operador.perfil === "admin" ? "primary" : "success"}
                size="small"
                sx={{ mt: 0.5, fontWeight: 600 }}
              />
            </CardContent>
            <CardActions sx={{ p: 0 }}>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                color="error"
                onClick={logout}
                sx={{
                  minWidth: 0,
                  px: 2,
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#ffeaea" }
                }}
              >
                Logout
              </Button>
            </CardActions>
          </Card>
  
          {/* Conteúdo principal da aplicação */}
          <Box sx={{ px: { xs: 1, md: 4 }, pb: 4 }}>
            {paginaAtual === "menu" && <Menu />}
            {paginaAtual === "registo" && (
              <Registo
                vendas={vendas}
                numeroAtual={numeroAtual}
                setNumeroAtual={setNumeroAtual}
                primeiroNumero={primeiroNumero}
                setPrimeiroNumero={setPrimeiroNumero}
                setTotalVendas={setTotalVendas}
                totalVendas={totalVendas}
                novoNumero={novoNumero}
                setNovoNumero={setNovoNumero}
                inputBloqueado={inputBloqueado}
                setInputBloqueado={setInputBloqueado}
                operador={operador}
                vendedor={operador}
                turnoAberto={turnoAberto}
                abrirTurno={abrirTurno}
                fecharTurno={fecharTurno}
                horaAbertura={horaAbertura}
                vender={vender}
                venderAzul={venderAzul}
                anularVenda={anularVenda}
                exportarCSV={exportarCSV}
                exportarPDF={exportarPDF}
                venderPromoFamiliar={venderPromoFamiliar}
              />
            )}
            {paginaAtual === "historico" && (
              <Historico onVoltar={() => setPaginaAtual("menu")} vendas={vendas} />
            )}
            {paginaAtual === "estatisticas" && <Estatisticas vendas={vendas} />}
<<<<<<< HEAD
            {paginaAtual === "horarios" && (
  <Horarios operador={operador} utilizadores={utilizadores} />
)}

=======
>>>>>>> f134ee1e8e2f5a7685ec1624f05c6d4ad212b7f7
            {paginaAtual === "admin" && operador?.perfil === "admin" && (
  <AdminVendas />
)}
            {paginaAtual === "gestao" && operador?.perfil === "admin" && (
              <GestaoUtilizadores
                utilizadores={utilizadores}
                criarUtilizador={criarUtilizador}
              />
            )}
            {paginaAtual === "alertas" && operador?.perfil === "admin" && (
  <EnviarAlerta />
)}
          </Box>
        </>
      )}
    </Box>
  );}