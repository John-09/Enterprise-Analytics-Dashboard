import { Layout } from "antd";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const { Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen" style={{ background: "#ffffff" }}>
      <Sidebar collapsed={collapsed} />

      <Layout style={{ background: "#ffffff" }}>
        <Navbar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <Content className="p-6 bg-white transition-colors">{children}</Content>
      </Layout>
    </Layout>
  );
}
