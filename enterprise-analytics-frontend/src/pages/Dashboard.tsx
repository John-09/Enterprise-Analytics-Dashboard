import { Row, Col, Alert, Card, Button } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined, DownloadOutlined } from "@ant-design/icons";
import KPICard from "../components/KPICard";
import RevenueChart from "../components/RevenueChart";
import DateRangeFilter from "../components/DateRangeFilter";
import ComparisonWidget from "../components/ComparisonWidget";
import RegionalChart from "../components/RegionalChart";
import TopCustomersCard from "../components/TopCustomersCard";
import DashboardCustomizer from "../components/DashboardCustomizer";
import { useKPIs } from "../hooks/useKPIs";
import { useRevenueTrend } from "../hooks/useRevenueTrend";
import { useDashboardPreferences, isWidgetVisible } from "@/hooks/useDashboardPreferences";
import dayjs from "dayjs";
import { useRole } from "@/hooks/useRole";
import { downloadPDF } from "../utils/pdfExport";

const DEFAULT_RANGE = {
  start: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD"),
};

export default function Dashboard() {
  const role = useRole();
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const kpis = useKPIs(range.start, range.end);
  const revenue = useRevenueTrend(range.start, range.end);
  const { data: preferences } = useDashboardPreferences();

  const isVisible = (id: string) => isWidgetVisible(id, preferences?.widgets);

  const handleExport = async () => {
    setExporting(true);
    await downloadPDF("dashboard-content", "dashboard-report");
    setExporting(false);
  };

  if (kpis.isError) {
    return (
      <Alert type="error" message="Failed to load dashboard data" showIcon />
    );
  }

  return (
    <div style={{ padding: isMobile ? 12 : 24 }}>
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <h1
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)", margin: 0 }}
        >
          Dashboard
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
          }}
        >
          {role !== "viewer" && (
            <>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                loading={exporting}
                size={isMobile ? "small" : "middle"}
              >
                {!isMobile && "Export PDF"}
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setShowCustomizer(true)}
                size={isMobile ? "small" : "middle"}
              >
                {!isMobile && "Customize"}
              </Button>
            </>
          )}
          <DateRangeFilter
            value={[dayjs(range.start), dayjs(range.end)]}
            onChange={(start, end) =>
              setRange({
                start: start || "",
                end: end || "",
              })
            }
          />
        </div>
      </div>

      <div id="dashboard-content">
        {/* KPI Overview */}
        {isVisible("kpi-overview") && (
          <div style={{ marginBottom: 24 }}>
            <h2
              className="text-lg font-medium"
              style={{ color: "var(--text-primary)", marginBottom: 12 }}
            >
              Overview
            </h2>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <KPICard
                  title="Total Orders"
                  value={kpis.data?.totalOrders}
                  loading={kpis.isLoading}
                />
              </Col>
              <Col xs={24} sm={8}>
                <KPICard
                  title="Total Revenue"
                  value={kpis.data?.totalRevenue}
                  prefix="$"
                  precision={2}
                  loading={kpis.isLoading}
                />
              </Col>
              <Col xs={24} sm={8}>
                <KPICard
                  title="Active Customers"
                  value={kpis.data?.activeCustomers}
                  loading={kpis.isLoading}
                />
              </Col>
            </Row>
          </div>
        )}

        {/* Analytics Section - Manager/Admin only */}
        {role !== "viewer" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Period Comparison */}
            {isVisible("comparison") && (
              <ComparisonWidget
                currentStart={range.start}
                currentEnd={range.end}
              />
            )}

            {/* Revenue Trend Chart */}
            {isVisible("revenue-chart") && (
              <Card title="Revenue Insights">
                <RevenueChart
                  data={revenue.data || []}
                  loading={revenue.isLoading}
                />
              </Card>
            )}

            {/* Regional Analytics and Top Customers */}
            <Row gutter={[16, 16]}>
              {isVisible("regional") && (
                <Col xs={24} lg={isVisible("top-customers") ? 14 : 24}>
                  <RegionalChart
                    startDate={range.start}
                    endDate={range.end}
                  />
                </Col>
              )}
              {isVisible("top-customers") && (
                <Col xs={24} lg={isVisible("regional") ? 10 : 24}>
                  <TopCustomersCard
                    startDate={range.start}
                    endDate={range.end}
                    limit={5}
                  />
                </Col>
              )}
            </Row>
          </div>
        )}
      </div>

      {/* Customizer Modal */}
      <DashboardCustomizer
        open={showCustomizer}
        onClose={() => setShowCustomizer(false)}
      />
    </div>
  );
}
