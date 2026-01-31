import { useSelector } from "react-redux";
import type{ RootState } from "../store";

export const useRole = () => {
  return useSelector((state: RootState) => state.auth.user?.role);
};
