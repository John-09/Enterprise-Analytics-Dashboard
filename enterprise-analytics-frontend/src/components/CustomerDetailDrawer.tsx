import {
  Drawer,
  Descriptions,
  Table,
  Card,
  Statistic,
  Row,
  Col,
  Tag,
  Spin,
  Empty,
  Typography,
} from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useCustomer, useCustomerAnalytics } from "@/hooks/useCustomers";
import type { ColumnsType } from "antd/es/table";
import type { Order } from "@/api/customers";

const { Title } = Typography;

interface CustomerDetailDrawerProps {
  customerId: number | null;
  onClose: () => void;
}

export default function CustomerDetailDrawer({
  customerId,
  onClose,
}: CustomerDetailDrawerProps) {
  const { data: customer, isLoading } = useCustomer(customerId);
  const { data: analytics, isLoading: analyticsLoading } =
    useCustomerAnalytics(customerId);

  const orderColumns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) =>
        `$${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          completed: "green",
          pending: "orange",
          cancelled: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Drawer
      title={
        <span className="text-lg font-semibold">
          {isLoading ? "Loading..." : customer?.name || "Customer Details"}
        </span>
      }
      placement="right"
      width={600}
      open={customerId !== null}
      onClose={onClose}
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : !customer ? (
        <Empty description="Customer not found" />
      ) : (
        <div className="space-y-6">
          {/* Customer Info */}
          <Card size="small">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Customer ID">
                #{customer.id}
              </Descriptions.Item>
              <Descriptions.Item label="Region">
                <Tag color="blue">{customer.region}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Member Since">
                {new Date(customer.createdAt).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Analytics */}
          <Card size="small" title="Customer Analytics" loading={analyticsLoading}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Lifetime Value"
                  value={analytics?.lifetimeValue || 0}
                  precision={2}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Total Orders"
                  value={analytics?.totalOrders || 0}
                  prefix={<ShoppingCartOutlined />}
                />
              </Col>
            </Row>
            <Row gutter={16} className="mt-4">
              <Col span={12}>
                <Statistic
                  title="Avg Order Value"
                  value={analytics?.averageOrderValue || 0}
                  precision={2}
                  prefix={<TrophyOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Completed Orders"
                  value={analytics?.completedOrders || 0}
                  prefix={<CalendarOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* Order History */}
          <Card size="small">
            <Title level={5} className="mb-4">
              Order History
            </Title>
            <Table
              columns={orderColumns}
              dataSource={customer.orders || []}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </div>
      )}
    </Drawer>
  );
}
