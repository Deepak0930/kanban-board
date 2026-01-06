"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

const menu = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Kanban Board", path: "/board" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box width={240} borderRight="1px solid #eee" p={2}>
      <Typography variant="h6" mb={3}>
        Kanban
      </Typography>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path}
            onClick={() => router.push(item.path)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
