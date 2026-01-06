"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export const AuthProvider = ({ children }) => {
  const { syncUser } = useAuthStore();

  useEffect(() => {
    syncUser();
  }, []);

  return children;
};
