import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Skeleton } from "antd";
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
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : !loading && data.length < 2 ? (
          <div className="flex justify-center items-center h-[300px] text-gray-400">
            No data available for selected date range
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
