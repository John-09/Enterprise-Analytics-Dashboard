import { useEffect } from "react";
import { useSelector } from "react-redux";
import type{ RootState } from "../store";

export const useThemeEffect = () => {
  const theme = useSelector((s: RootState) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
};
