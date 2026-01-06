"use client";

import { Box, Avatar, Button } from "@mui/material";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Box
      height={64}
      px={3}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      borderBottom="1px solid #eee"
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={user?.profilePic} />
        <Button size="small" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
}
