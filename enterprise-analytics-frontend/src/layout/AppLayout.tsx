import { Layout } from "antd";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const { Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Check on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout className="min-h-screen">
      {/* Mobile overlay backdrop */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setCollapsed(true)}
        />
      )}

      <Sidebar collapsed={collapsed} isMobile={isMobile} />

      <Layout>
        <Navbar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          isMobile={isMobile}
        />

        <Content
          className="transition-colors"
          style={{ padding: isMobile ? 12 : 24 }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
