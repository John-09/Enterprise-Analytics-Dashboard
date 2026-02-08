import { Row, Col, Spin, Alert, Card, Button } from "antd";
import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
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

const DEFAULT_RANGE = {
  start: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD"),
};

export default function Dashboard() {
  const role = useRole();
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const kpis = useKPIs(range.start, range.end);
  const revenue = useRevenueTrend(range.start, range.end);
  const { data: preferences } = useDashboardPreferences();

  const isVisible = (id: string) => isWidgetVisible(id, preferences?.widgets);

  if (kpis.isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <Spin size="large" />
      </div>
    );
  }

  if (kpis.isError) {
    return (
      <Alert type="error" message="Failed to load dashboard data" showIcon />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-3">
          {role !== "viewer" && (
            <Button
              icon={<SettingOutlined />}
              onClick={() => setShowCustomizer(true)}
            >
              Customize
            </Button>
          )}
          <DateRangeFilter
            value={[dayjs(range.start), dayjs(range.end)]}
            onChange={(start, end) => setRange({ start, end })}
          />
        </div>
      </div>

      {/* KPI Overview */}
      {isVisible("kpi-overview") && kpis.data && (
        <Card title="Overview" className="mb-6">
          <Row gutter={16}>
            <Col span={8}>
              <KPICard title="Total Orders" value={kpis.data.totalOrders} />
            </Col>
            <Col span={8}>
              <KPICard title="Total Revenue" value={kpis.data.totalRevenue} />
            </Col>
            <Col span={8}>
              <KPICard
                title="Active Customers"
                value={kpis.data.activeCustomers}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Analytics Section - Manager/Admin only */}
      {role !== "viewer" && (
        <>
          {/* Period Comparison */}
          {isVisible("comparison") && (
            <ComparisonWidget
              currentStart={range.start}
              currentEnd={range.end}
            />
          )}

          {/* Revenue Trend Chart */}
          {isVisible("revenue-chart") && (
            <Card title="Revenue Insights" className="mb-6">
              <RevenueChart data={revenue.data || []} loading={revenue.isLoading} />
            </Card>
          )}

          {/* Regional Analytics and Top Customers */}
          <Row gutter={16}>
            {isVisible("regional") && (
              <Col span={isVisible("top-customers") ? 14 : 24}>
                <RegionalChart startDate={range.start} endDate={range.end} />
              </Col>
            )}
            {isVisible("top-customers") && (
              <Col span={isVisible("regional") ? 10 : 24}>
                <TopCustomersCard
                  startDate={range.start}
                  endDate={range.end}
                  limit={5}
                />
              </Col>
            )}
          </Row>
        </>
      )}

      {/* Customizer Modal */}
      <DashboardCustomizer
        open={showCustomizer}
        onClose={() => setShowCustomizer(false)}
      />
    </div>
  );
}
