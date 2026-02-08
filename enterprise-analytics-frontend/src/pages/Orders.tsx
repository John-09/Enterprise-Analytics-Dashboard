import api from "../api/axios";
import { Button, Card, message } from "antd";
import OrdersTable from "../components/OrdersTable";

export default function Orders() {
  const exportCSV = async () => {
    try {
      const res = await api.get("/orders/export", {
        responseType: "blob",
      });

      if (res.status === 204) {
        message.info("No data available for export");
        return;
      }

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "orders.csv";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      message.error("Failed to export CSV");
    }
  };

  return (
    <Card
      title="Orders"
      extra={<Button onClick={exportCSV}>Export CSV</Button>}
    >
      <OrdersTable />
    </Card>
  );
}
