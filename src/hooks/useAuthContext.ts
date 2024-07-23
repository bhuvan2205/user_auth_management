import { useContext } from "react";
import { AuthContext } from "../context/auth";

export default function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext is not defined");
  return context;
}
