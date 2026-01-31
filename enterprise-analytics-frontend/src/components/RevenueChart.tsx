import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Spin } from "antd";
import dayjs from "dayjs";

interface Props {
  data: { date: string; revenue: number }[];
  loading: boolean;
}

export default function RevenueChart({ data, loading }: Props) {
  return (
    <>
      <Card title="Revenue Trend" className="mt-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : !loading && data.length < 2 ? (
          <div className="flex justify-center items-center text-gray-400">
            Not enough data to show trend
          </div>
        ) : (
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => dayjs(value).format("DD MMM")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => dayjs(label).format("DD MMM YYYY")}
                />
                <Line type="monotone" dataKey="revenue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </>
  );
}
