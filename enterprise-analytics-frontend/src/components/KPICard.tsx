import { Card, Statistic } from "antd";

interface Props {
  title: string;
  value: number;
}

export default function KPICard({ title, value }: Props) {
  return (
    <Card className="shadow-sm">
      <Statistic title={title} value={value} />
    </Card>
  );
}
