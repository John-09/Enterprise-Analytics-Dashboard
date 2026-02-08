import { useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Card,
  Space,
  Tag,
  Typography,
  Spin,
  Alert,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useCustomers, useRegions } from "@/hooks/useCustomers";
import CustomerDetailDrawer from "../components/CustomerDetailDrawer";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { Customer } from "@/api/customers";

const { Title } = Typography;

export default function Customers() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  // Debounce search
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useCustomers({
    page,
    limit,
    search: debouncedSearch,
    region,
  });

  const { data: regions } = useRegions();

  const columns: ColumnsType<Customer> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-medium text-blue-600 cursor-pointer hover:underline">
          <UserOutlined className="mr-2" />
          {name}
        </span>
      ),
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      render: (region: string) => <Tag color="blue">{region}</Tag>,
    },
    {
      title: "Total Orders",
      dataIndex: "totalOrders",
      key: "totalOrders",
      align: "right",
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: "Lifetime Value",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      align: "right",
      render: (value: number) =>
        `$${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current || 1);
  };

  if (isError) {
    return (
      <div className="p-6">
        <Alert type="error" message="Failed to load customers" showIcon />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">
        Customer Management
      </Title>

      <Card className="mb-6">
        <Space wrap>
          <Input
            placeholder="Search customers..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Filter by region"
            value={region}
            onChange={(value) => {
              setRegion(value);
              setPage(1);
            }}
            style={{ width: 180 }}
            allowClear
          >
            {regions?.map((r) => (
              <Select.Option key={r} value={r}>
                {r}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Card>

      <Card>
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={data?.data || []}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.pagination.total || 0,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} customers`,
            }}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => setSelectedCustomerId(record.id),
              style: { cursor: "pointer" },
            })}
          />
        </Spin>
      </Card>

      <CustomerDetailDrawer
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />
    </div>
  );
}
