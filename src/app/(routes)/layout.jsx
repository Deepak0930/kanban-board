"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const drawerWidth = 250;

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    path: "/dashboard",
  },
  {
    label: "Kanban Board",
    icon: <ViewKanbanIcon fontSize="small" />,
    path: "/board",
  },
];

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user, logout } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLinkClick = (path) => {
    router.push(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box sx={{ mt: "64px" }}>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path}
            onClick={() => {
              handleLinkClick(item.path);
            }}
          >
            <Box mr={1}>{item.icon}</Box>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: "none",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            {isMobile && (
              <IconButton edge="start" onClick={toggleDrawer} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" fontWeight={500}>
              {pathname === "/dashboard" ? "Dashboard" : "Kanban Board"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title={user?.name || ""}>
              <Avatar src={user?.profilePic || "./profile.jpeg"} />
            </Tooltip>
            <Button size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              ...(!isMobile && {
                boxSizing: "border-box",
                borderRight: "1px solid #eee",
              }),
            },
          }}
          {...(isMobile && {
            onClose: toggleDrawer,
            ModalProps: { keepMounted: true },
          })}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: "64px",
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "#fafafa",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
