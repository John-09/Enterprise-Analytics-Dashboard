import { createSlice } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

const initialState: { theme: ThemeMode } = {
  theme: (localStorage.getItem("theme") as ThemeMode) || "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
