import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Spin } from "antd";

interface Props {
  data: { date: string; revenue: number }[];
  loading: boolean;
}

export default function RevenueChart({ data, loading }: Props) {
  return (
    <Card title="Revenue Trend" className="mt-6">
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
