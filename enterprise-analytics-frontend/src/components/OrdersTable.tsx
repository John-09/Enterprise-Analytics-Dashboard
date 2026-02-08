import { Table, Input, Select } from "antd";
import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { useDebounce } from "../hooks/useDebounce";
import dayjs from "dayjs";

const { Search } = Input;

export default function OrdersTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>();
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useOrders({
    page,
    limit: 10,
    status,
    search: debouncedSearch,
  });

  const columns = [
    { title: "Order ID", dataIndex: "id" },
    {
      title: "Customer",
      render: (_: any, row: any) => row.customer.name,
    },
    { title: "Amount", dataIndex: "amount" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value: string) => dayjs(value).format("DD MMM YYYY, HH:mm"),
    },
  ];

  return (
    <div className="mt-6">
      <div className="flex gap-4 mb-4">
        <Search
          placeholder="Search customer"
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          allowClear
          style={{ width: 200 }}
        />

        <Select
          placeholder="Status"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={[
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      </div>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.total || 0,
          showSizeChanger: false,
          onChange: (p) => setPage(p),
        }}
        locale={{
          emptyText: isLoading
            ? "Failed to load orders"
            : "No orders found for selected filters",
        }}
      />
    </div>
  );
}
