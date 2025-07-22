import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Tilt from "react-parallax-tilt";

// Substituir pelo URL/local do teu logotipo
const LOGO_URL = "/logos-municipios-01.png";

export default function Menu() {
  return (
    <Box sx={{ backgroundColor: "transparent",position: "relative", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", mt: { xs: 8, md: 12 }}}>
      {/* Fundo com logotipo em transparência */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${LOGO_URL})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          opacity: 0.20,
          pointerEvents: "none",
          height: "100%",
          width: "100%"
        }}
      />

      {/* Conteúdo principal — centralizado e apelativo */}
      <Paper
        elevation={4}
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: 540,
          mx: "auto",
          p: 5,
          bgcolor: "rgba(255,255,255,0.93)",
          borderRadius: 4,
          boxShadow: 6,
          backdropFilter: "blur(3px)",
          mt: { xs: 3, md: 6 },
        }}
      >
        <Tilt glareEnable glareMaxOpacity={0.19} scale={1.05}>
  <img src="/favicon.png"
       alt="Logo"
       style={{
         width: 180,
         margin: "40px auto",
         display: "block",
         filter: "drop-shadow(0 0 20px #00eaffcf)"
       }}
  />
</Tilt>
        <Typography variant="h3" color="primary" fontWeight={700} mb={2} align="center">
          Sistema de Registo <br /> de Pulseiras de Verão
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }} align="center" color="text.secondary">
          Piscina Municipal da Guarda
        </Typography>

        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Bem-vindo ao portal oficial para registo, consulta e gestão de pulseiras de acesso de verão.<br/>
          Este serviço é exclusivo para uso interno de funcionários autorizados.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <ul style={{ fontSize: 17 }}>
          <li><b>Registo Rápido:</b> Pulseiras para Adulto, Menor e Pack Família.</li>
          <li><b>Gestão Segura:</b> Acesso por PIN, controlo de turnos e permissões.</li>
          <li><b>Histórico Completo:</b> Consultar vendas por data e exportar relatórios PDF/CSV.</li>
          <li><b>Dashboard:</b> Estatísticas visuais de vendas e operações.</li>
        </ul>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, opacity: 0.7 }}>
          © {new Date().getFullYear()} Câmara Municipal da Guarda &middot; Piscinas Municipais
        </Typography>
      </Paper>
    </Box>
  );
}
