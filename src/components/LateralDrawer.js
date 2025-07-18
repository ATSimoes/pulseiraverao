import React from "react";
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";


const drawerWidth = 220;

export default function LateralDrawer({ paginaAtual, setPaginaAtual, isAdmin }) {
  const [open, setOpen] = React.useState(false);

  const items = [
    { label: "Menu Inicial", icon: <HomeIcon />, val: "menu" },
    { label: "Registo de Pulseiras", icon: <AssignmentIcon />, val: "registo" },
    { label: "Histórico", icon: <HistoryIcon />, val: "historico" },
    isAdmin && {
      label: "Gestão de Utilizadores", icon: <PeopleIcon />, val: "gestao"
    }
  ].filter(Boolean);

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ position: "absolute", top: 18, left: 18, zIndex: 2000 }}
        color="primary"
        size="large"
        aria-label="Abrir menu lateral"
      >
        <MenuIcon fontSize="inherit" />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ width: drawerWidth, flexShrink: 0 }}
        PaperProps={{ sx: { width: drawerWidth } }}
      >
        <Toolbar sx={{ mt: 2 }} />
        <Divider />
        <List>
          {items.map(({ label, icon, val }) => (
            <ListItem
              button
              key={val}
              selected={paginaAtual === val}
              onClick={() => {
                setPaginaAtual(val);
                setOpen(false);
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: "auto" }} />
        <ListItem>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Preferências" />
        </ListItem>
      </Drawer>
    </>
  );
}
