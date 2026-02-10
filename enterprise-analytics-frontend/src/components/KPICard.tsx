import { Card, Statistic, Skeleton } from "antd";

interface Props {
  title: string;
  value: number | undefined;
  loading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  precision?: number;
}

export default function KPICard({
  title,
  value,
  loading = false,
  prefix,
  suffix,
  precision = 0,
}: Props) {
  return (
    <Card className="shadow-sm kpi-card animate-fade-in-up h-full border-gray-200 dark:border-slate-700">
      <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
        <Statistic
          title={title}
          value={value}
          precision={precision}
          valueStyle={{ fontWeight: 600 }}
          prefix={prefix}
          suffix={suffix}
          formatter={(val) =>
            new Intl.NumberFormat("en-IN", {
              minimumFractionDigits: precision,
              maximumFractionDigits: precision,
            }).format(Number(val))
          }
        />
      </Skeleton>
    </Card>
  );
}
