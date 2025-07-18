import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuTopo from "./components/MenuTopo";
import Registo from "./pages/Registo";
import Historico from "./pages/Historico";
import Menu from "./pages/Menu";
import GestaoUtilizadores from "./pages/GestaoUtilizadores";
import { dataHoje, obterPreco } from "./utils/helpers";
import LateralDrawer from "./components/LateralDrawer";
import Estatisticas from "./pages/Estatisticas";
import Fade from "@mui/material/Fade";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Chip from "@mui/material/Chip";

// --- Autenticação e configuração iniciais ---
export default function App() {
  const [paginaAtual, setPaginaAtual] = useState(
  () => localStorage.getItem("paginaAtual") || "menu"
);

useEffect(() => {
  localStorage.setItem("paginaAtual", paginaAtual);
}, [paginaAtual]);


  // Utilizadores e operador
  const [utilizadores, setUtilizadores] = useState(() =>
    JSON.parse(localStorage.getItem("utilizadores") || '[{"nome":"admin","pin":"1234","perfil":"admin"}]')
  );
  const [operador, setOperador] = useState(() => {
  const armazenado = localStorage.getItem("operador");
  return armazenado ? JSON.parse(armazenado) : null;
});
  const [loginPin, setLoginPin] = useState("");
  const [loginNome, setLoginNome] = useState("");

  // Menu Drawer
  <LateralDrawer
  paginaAtual={paginaAtual}
  setPaginaAtual={setPaginaAtual}
  isAdmin={operador?.perfil === "admin"}
/>

  // Turno
const [turnoAberto, setTurnoAberto] = useState(
  () => JSON.parse(localStorage.getItem("turnoAberto")) || false
);
const [horaAbertura, setHoraAbertura] = useState(
  () => localStorage.getItem("horaAbertura") ? new Date(localStorage.getItem("horaAbertura")) : null
);
// Sempre que mudar o turno ou hora, grava:
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

  // Registo vendas
  const [numeroAtual, setNumeroAtual] = useState(1);
  const [primeiroNumero, setPrimeiroNumero] = useState(1);
  const [novoNumero, setNovoNumero] = useState("");
  const [vendas, setVendas] = useState(() => {
  const salvas = localStorage.getItem("vendasAtuais");
  return salvas ? JSON.parse(salvas) : [];
});
useEffect(() => {
  localStorage.setItem("vendasAtuais", JSON.stringify(vendas));
}, [vendas]);
  const [totalVendas, setTotalVendas] = useState(0);
  const [inputBloqueado, setInputBloqueado] = useState(() => {
  const salvo = localStorage.getItem("inputBloqueado");
  return salvo ? JSON.parse(salvo) : false;
});

useEffect(() => {
  localStorage.setItem("inputBloqueado", JSON.stringify(inputBloqueado));
}, [inputBloqueado]);



  // Guardar utilizadores no localStorage sempre que mudam
  useEffect(() => {
    localStorage.setItem("utilizadores", JSON.stringify(utilizadores));
  }, [utilizadores]);

  // Login por PIN
  function loginOperador() {
  const user = utilizadores.find(u => u.nome === loginNome && u.pin === loginPin);
  if (user) {
    setOperador(user);
    // Guarda no localStorage:
    localStorage.setItem("operador", JSON.stringify(user));
    setLoginNome("");
    setLoginPin("");
  } else {
    alert("Nome de utilizador ou PIN incorretos!");
  }
}
  // Turnos
  function abrirTurno() {
    if (!operador) {
      alert("Por favor autentique-se antes de abrir turno.");
      return;
    }
    setTurnoAberto(true);
    const now = new Date();
    setHoraAbertura(now);
    localStorage.setItem("turnoAberto", "true");
    localStorage.setItem("horaAbertura", now.toISOString());
    setVendas([]);
    setTotalVendas(0);
  }
  function fecharTurno() {
    setVendas([]);
  setInputBloqueado(false);
  localStorage.removeItem("vendasAtuais");
  localStorage.setItem("inputBloqueado", "false");
    setTurnoAberto(false);
    setHoraAbertura(null);
    localStorage.setItem("turnoAberto", "false");
    localStorage.removeItem("horaAbertura");
    const now = new Date();
    alert(
      `Turno fechado.\nOperador: ${operador?.nome}\nHora abertura: ${horaAbertura?.toLocaleTimeString("pt-PT")}\nHora fecho: ${now.toLocaleTimeString("pt-PT")}\nTotal vendido: ${totalVendas} €`
    );
  }

  // Venda de pulseira
  const vender = useCallback(
    (tipo) => {
      if (!operador || !turnoAberto) return;
      const data = new Date();
      const preco = tipo === "pack" ? 0 : obterPreco(tipo, data);
      const novaVenda = {
        numero: numeroAtual,
        tipo:
          tipo === "pack"
            ? "Pack Família"
            : tipo.charAt(0).toUpperCase() + tipo.slice(1),
        preco,
        hora: data.toLocaleTimeString("pt-PT"),
        operador: operador ? operador.nome : "-",
      };
      setVendas((v) => [...v, novaVenda]);
      setNumeroAtual((n) => n + 1);
      setTotalVendas((tot) => +(tot + preco).toFixed(2));
    },
    [numeroAtual, operador, turnoAberto]
  );
// Vender Azul
  function venderAzul(numeroManual) {
  const data = new Date();
  const novaVenda = {
    numero: numeroManual,
    tipo: "Azul (Piscina Interior)",
    preco: 1.6,
    hora: data.toLocaleTimeString("pt-PT"),
    operador: operador?.nome || "-",
  };

  setVendas((prev) => [...prev, novaVenda]);
  setTotalVendas((prev) => +(prev + 1.6).toFixed(2));
}
  // Atalhos de teclado (F1/F2/F3)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!inputBloqueado || paginaAtual !== "registo" || !turnoAberto || !operador) return;
      if (e.key === "F1") { e.preventDefault(); vender("adulto"); }
      if (e.key === "F2") { e.preventDefault(); vender("menor"); }
      if (e.key === "F3") { e.preventDefault(); vender("pack"); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputBloqueado, paginaAtual, vender, operador, turnoAberto]);

  // Exportar CSV
  const exportarCSV = () => {
    let csv = "Número,Tipo,Valor,Hora,Operador\n";
    vendas.forEach((v) => {
      csv += `${v.numero},${v.tipo},${v.preco},${v.hora},${v.operador || "-"}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendas_${dataHoje()}.csv`;
    a.click();
  };

  // Exportar PDF
  function exportarPDF() {
    Promise.all([
      import("jspdf"),
      import("jspdf-autotable")
    ]).then(([jsPDFModule, autoTableModule]) => {
      const jsPDF = jsPDFModule.default;
      const autoTable = autoTableModule.default;

      const doc = new jsPDF();

      doc.text("Relatório de Vendas de Pulseiras", 10, 10);

      autoTable(doc, {
        startY: 20,
        head: [["Número", "Tipo", "Valor", "Hora", "Operador"]],
        body: vendas.map((v) => [
          v.numero,
          v.tipo,
          v.preco,
          v.hora,
          v.operador || "-"
        ])
      });

      doc.save(`vendas_${dataHoje()}.pdf`);
    });
  }

  // Guardar vendas em localStorage
  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("historicoPulseiras") || "{}");
    h[dataHoje()] = vendas;
    localStorage.setItem("historicoPulseiras", JSON.stringify(h));
  }, [vendas]);

  // Anular venda (só admin)
  const anularVenda = (idx) => {
    if (operador?.perfil !== "admin") return alert("Só o admin pode anular vendas.");
    if (!window.confirm("Tens a certeza que queres anular esta venda?")) return;
    const novaLista = [...vendas];
    const removida = novaLista.splice(idx, 1)[0];
    setVendas(novaLista);
    setTotalVendas((prev) => +(prev - removida.preco).toFixed(2));
  };

  // -- Interface principal --
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Menu topo com tabs dinâmicos admin/funcionário */}
      <MenuTopo
        paginaAtual={paginaAtual}
        setPaginaAtual={setPaginaAtual}
        isAdmin={operador?.perfil === "admin"}
      />

      {/* Painel de login */}
      {!operador && (
        <Fade in={true} timeout={800}>
        <Box sx={{ bgcolor: "#fff3e0", p: 3, mb: 4, borderRadius: 2, maxWidth: 400, mx: "auto", boxShadow: 2 }}>
          <Typography variant="h6" mb={1}>Autenticação</Typography>
          <select
            value={loginNome}
            onChange={e => setLoginNome(e.target.value)}
            style={{ width: "100%", marginBottom: "12px", padding: 8, borderRadius: 4 }}
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
            style={{ width: "100%", marginBottom: "12px", padding: 8, borderRadius: 4 }}
            maxLength={6}
          />
          <Button variant="contained" fullWidth size="large" onClick={loginOperador}>Entrar</Button>
        </Box>
        </Fade>
      )}

      {/* Linha de operador logado */}
      {operador && (
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
      gap: 2,
    }}
  >
    <Avatar
      sx={{
        width: 54,
        height: 54,
        bgcolor: operador.perfil === "admin" ? "primary.main" : "success.main",
        mr: 2,
      }}
    >
      <PersonIcon sx={{ fontSize: 36, color: "#fff" }} />
    </Avatar>
    <CardContent sx={{ flex: 1, p: 0 }}>
      <strong style={{ fontSize: 17 }}>{operador.nome}</strong>
      <br />
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
        onClick={() => {
    setOperador(null);
    localStorage.removeItem("operador");
  }}
        sx={{
          minWidth: 0,
          px: 2,
          fontWeight: 700,
          "&:hover": { bgcolor: "#ffeaea" },
        }}
      >
        Logout
      </Button>
    </CardActions>
  </Card>
)}

      {/* Páginas principais */}
      <Box sx={{ px: { xs: 1, md: 4 }, pb: 4 }}>
        {paginaAtual === "menu" && <Menu />}
        {paginaAtual === "registo" && (
          <Registo
            vendas={vendas}
            numeroAtual={numeroAtual}
            setNumeroAtual={setNumeroAtual}
            primeiroNumero={primeiroNumero}
            setPrimeiroNumero={setPrimeiroNumero}
            setVendas={setVendas}
            setTotalVendas={setTotalVendas}
            totalVendas={totalVendas}
            novoNumero={novoNumero}
            setNovoNumero={setNovoNumero}
            inputBloqueado={inputBloqueado}
            setInputBloqueado={setInputBloqueado}
            operador={operador}
            turnoAberto={turnoAberto}
            abrirTurno={abrirTurno}
            fecharTurno={fecharTurno}
            horaAbertura={horaAbertura}
            vender={vender}
            anularVenda={anularVenda}
            exportarCSV={exportarCSV}
            exportarPDF={exportarPDF}
            venderAzul={venderAzul}

          />
        )}
        {paginaAtual === "historico" && <Historico onVoltar={() => setPaginaAtual("menu")} />}
          {paginaAtual === "estatisticas" && <Estatisticas />}
        {paginaAtual === "gestao" && operador?.perfil === "admin" && (
          <GestaoUtilizadores utilizadores={utilizadores} setUtilizadores={setUtilizadores} />
        )}
      </Box>
    </Box>
  );
}
