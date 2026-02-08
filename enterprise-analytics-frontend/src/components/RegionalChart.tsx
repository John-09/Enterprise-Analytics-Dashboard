import { Card, Spin, Empty } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useRegionalAnalytics } from "@/hooks/useDashboardAnalytics";

interface RegionalChartProps {
  startDate?: string;
  endDate?: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"];

export default function RegionalChart({ startDate, endDate }: RegionalChartProps) {
  const { data, isLoading } = useRegionalAnalytics(startDate, endDate);

  if (isLoading) {
    return (
      <Card title="Revenue by Region" className="mb-6">
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Revenue by Region" className="mb-6">
        <Empty description="No regional data available" />
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.region,
    value: item.revenue,
    orders: item.orderCount,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">
            Revenue: ${data.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-gray-600">Orders: {data.orders}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Revenue by Region" className="mb-6">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
