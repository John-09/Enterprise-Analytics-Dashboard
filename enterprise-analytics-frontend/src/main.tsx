import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store, { type RootState } from "./store";
import "antd/dist/reset.css";
import "./index.css"; // Tailwind entry
import { lightTheme, darkTheme } from "./theme/antdTheme";
import { ConfigProvider } from "antd";
const queryClient = new QueryClient();

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useSelector((s: RootState) => s.ui.theme);
  return (
    <ConfigProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      {children}
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);
