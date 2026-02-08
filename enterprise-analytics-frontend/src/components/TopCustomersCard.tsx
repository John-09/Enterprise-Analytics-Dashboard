import { Card, List, Spin, Empty, Tag } from "antd";
import { TrophyOutlined, CrownOutlined } from "@ant-design/icons";
import { useDashboardTopCustomers } from "@/hooks/useDashboardAnalytics";

interface TopCustomersCardProps {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export default function TopCustomersCard({
  startDate,
  endDate,
  limit = 5,
}: TopCustomersCardProps) {
  const { data, isLoading } = useDashboardTopCustomers(limit, startDate, endDate);

  if (isLoading) {
    return (
      <Card title="Top Customers" className="mb-6">
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Top Customers" className="mb-6">
        <Empty description="No customer data available" />
      </Card>
    );
  }

  const getMedalIcon = (index: number) => {
    if (index === 0) return <CrownOutlined style={{ color: "#FFD700", fontSize: 20 }} />;
    if (index === 1) return <TrophyOutlined style={{ color: "#C0C0C0", fontSize: 18 }} />;
    if (index === 2) return <TrophyOutlined style={{ color: "#CD7F32", fontSize: 16 }} />;
    return <span className="text-gray-400 font-bold">#{index + 1}</span>;
  };

  return (
    <Card
      title={
        <span>
          <TrophyOutlined className="mr-2 text-yellow-500" />
          Top Customers
        </span>
      }
      className="mb-6"
    >
      <List
        dataSource={data}
        renderItem={(customer, index) => (
          <List.Item
            key={customer.id}
            className="hover:bg-gray-50 transition-colors px-2 rounded"
          >
            <div className="flex items-center w-full">
              <div className="w-8 flex justify-center">
                {getMedalIcon(index)}
              </div>
              <div className="flex-1 ml-3">
                <div className="font-medium text-gray-800">{customer.name}</div>
                <div className="text-sm text-gray-500">
                  <Tag color="blue" className="mr-1">{customer.region}</Tag>
                  {customer.totalOrders} orders
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  ${customer.totalRevenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
