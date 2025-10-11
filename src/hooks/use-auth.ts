import { useState, useEffect } from "react";
import { getToken } from "@/integrations/api";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  const isAuthenticated = !!token;

  function logout() {
    localStorage.removeItem("jwt_token");
    setToken(null);
  }

  return { token, isAuthenticated, logout };
}
