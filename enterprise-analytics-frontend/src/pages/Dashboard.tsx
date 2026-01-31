import { Row, Col, Spin, Alert } from "antd";
import { useState } from "react";
import KPICard from "../components/KPICard";
import RevenueChart from "../components/RevenueChart";
import DateRangeFilter from "../components/DateRangeFilter";
import { useKPIs } from "../hooks/useKPIs";
import { useRevenueTrend } from "../hooks/useRevenueTrend";
import OrdersTable from "@/components/OrdersTable";

export default function Dashboard() {
  const [range, setRange] = useState<{
    start?: string;
    end?: string;
  }>({});

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
        <DateRangeFilter onChange={(start, end) => setRange({ start, end })} />
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <KPICard title="Total Orders" value={kpis.data.totalOrders} />
        </Col>
        <Col span={8}>
          <KPICard title="Total Revenue" value={kpis.data.totalRevenue} />
        </Col>
        <Col span={8}>
          <KPICard title="Active Customers" value={kpis.data.activeCustomers} />
        </Col>
      </Row>

      <RevenueChart data={revenue.data || []} loading={revenue.isLoading} />

      <OrdersTable />
    </div>
  );
}
