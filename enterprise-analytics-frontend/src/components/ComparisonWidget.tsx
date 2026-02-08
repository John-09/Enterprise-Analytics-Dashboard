import { Card, Statistic, Row, Col, Spin } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { useKPIComparison } from "@/hooks/useDashboardAnalytics";
import dayjs from "dayjs";

interface ComparisonWidgetProps {
  currentStart: string;
  currentEnd: string;
}

export default function ComparisonWidget({
  currentStart,
  currentEnd,
}: ComparisonWidgetProps) {
  // Calculate previous period dates (same duration before current start)
  const currentStartDate = dayjs(currentStart);
  const currentEndDate = dayjs(currentEnd);
  const duration = currentEndDate.diff(currentStartDate, "day") + 1;

  const previousEnd = currentStartDate.subtract(1, "day").format("YYYY-MM-DD");
  const previousStart = dayjs(previousEnd)
    .subtract(duration - 1, "day")
    .format("YYYY-MM-DD");

  const { data, isLoading } = useKPIComparison(
    currentStart,
    currentEnd,
    previousStart,
    previousEnd
  );

  if (isLoading) {
    return (
      <Card title="Period Comparison" className="mb-6">
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const renderChange = (change: number) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    const color = isPositive ? "#3f8600" : isNegative ? "#cf1322" : "#8c8c8c";
    const icon = isPositive ? (
      <ArrowUpOutlined />
    ) : isNegative ? (
      <ArrowDownOutlined />
    ) : (
      <MinusOutlined />
    );

    return (
      <span style={{ color, fontSize: 14 }}>
        {icon} {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  return (
    <Card
      title="Period Comparison"
      extra={
        <span className="text-gray-500 text-sm">
          vs {previousStart} to {previousEnd}
        </span>
      }
      className="mb-6"
    >
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Orders"
            value={data.current.totalOrders}
            suffix={renderChange(data.changes.totalOrders)}
          />
          <div className="text-gray-400 text-xs mt-1">
            Previous: {data.previous.totalOrders}
          </div>
        </Col>
        <Col span={8}>
          <Statistic
            title="Revenue"
            value={data.current.totalRevenue}
            precision={2}
            prefix="$"
            suffix={renderChange(data.changes.totalRevenue)}
          />
          <div className="text-gray-400 text-xs mt-1">
            Previous: ${data.previous.totalRevenue.toLocaleString()}
          </div>
        </Col>
        <Col span={8}>
          <Statistic
            title="Active Customers"
            value={data.current.activeCustomers}
            suffix={renderChange(data.changes.activeCustomers)}
          />
          <div className="text-gray-400 text-xs mt-1">
            Previous: {data.previous.activeCustomers}
          </div>
        </Col>
      </Row>
    </Card>
  );
}
