import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BarChartIcon from "@mui/icons-material/BarChart";

const drawerWidth = 240;

const navItems = [
  { text: "Home", path: "/", icon: <HomeIcon /> },
  { text: "Mint Property", path: "/property/mint", icon: <BusinessIcon /> },
  { text: "Fractionalize", path: "/property/fractionalize", icon: <MonetizationOnIcon /> },
  { text: "Create Escrow", path: "/property/escrow", icon: <AccountBalanceWalletIcon /> },
  { text: "Upload to IPFS", path: "/property/upload", icon: <BusinessIcon /> },
  { text: "Invest", path: "/invest", icon: <MonetizationOnIcon /> },
  { text: "Loan/Lien", path: "/liens", icon: <AccountBalanceWalletIcon /> },
  { text: "Admin", path: "/admin", icon: <AdminPanelSettingsIcon /> },
  { text: "Analytics", path: "/analytics", icon: <BarChartIcon /> },
];

export default function MainLayout({ currentAccount, onConnectWallet }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          DAPE Realty
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map(({ text, path, icon }) => (
          <ListItemButton
            component={Link}
            to={path}
            key={text}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  // Safely extract account initial
  let avatarInitial = "?";
  if (typeof currentAccount === "string" && currentAccount.length > 2) {
    avatarInitial = currentAccount[2].toUpperCase();
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            DAPE Realty DApp
          </Typography>
          {currentAccount ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar>{avatarInitial}</Avatar>
              <Typography variant="body1" noWrap>
                {currentAccount.substring(0, 6)}...{currentAccount.substring(currentAccount.length - 4)}
              </Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={onConnectWallet}
            >
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

