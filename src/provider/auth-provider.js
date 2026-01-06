"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export const AuthProvider = ({ children }) => {
  const syncUser = useAuthStore((s) => s.syncUser);

  useEffect(() => {
    syncUser();
  }, []);

  return children;
};
