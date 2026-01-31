import { Row, Col, Spin, Alert, Card } from "antd";
import { useState } from "react";
import KPICard from "../components/KPICard";
import RevenueChart from "../components/RevenueChart";
import DateRangeFilter from "../components/DateRangeFilter";
import { useKPIs } from "../hooks/useKPIs";
import { useRevenueTrend } from "../hooks/useRevenueTrend";
import OrdersTable from "@/components/OrdersTable";
import dayjs from "dayjs";
import { useRole } from "@/hooks/useRole";

const DEFAULT_RANGE = {
  start: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD"),
};

export default function Dashboard() {
  const role = useRole();
  const [range, setRange] = useState(DEFAULT_RANGE);

  const kpis = useKPIs(range.start, range.end);
  const revenue = useRevenueTrend(range.start, range.end);

  if (kpis.isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <Spin size="large" />
      </div>
    );
  }

  if (kpis.isError) {
    return <Alert message="Failed to load dashboard" type="error" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <DateRangeFilter
          value={[dayjs(range.start), dayjs(range.end)]}
          onChange={(start, end) => setRange({ start, end })}
        />
      </div>
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
      {role !== "viewer" && (
        <Card title="Revenue Insights" className="mb-6">
          <RevenueChart data={revenue.data || []} loading={revenue.isLoading} />
        </Card>
      )}
      {role !== "viewer" && (
        <Card title="Order Details">
          <OrdersTable />
        </Card>
      )}
    </div>
  );
}
