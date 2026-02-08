import { Button, Card, Table, Modal, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../api/users";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const res = await createUser(values);
      message.success(`User created. Temp password: ${res.tempPassword}`);
      setOpen(false);
      form.resetFields();
      loadUsers();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div>
      <Card
        title="User Management"
        extra={
          <Button type="primary" onClick={() => setOpen(true)}>
            Add User
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={users}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Email", dataIndex: "email" },
            {
              title: "Role",
              dataIndex: "role",
              render: (r) => r.toUpperCase(),
            },
            { title: "Created", dataIndex: "createdAt" },
          ]}
          locale={{
            emptyText: "No users available",
          }}
        />
      </Card>

      <Modal
        title="Add New User"
        open={open}
        onOk={handleCreate}
        onCancel={() => setOpen(false)}
        okText="Create User"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "admin", label: "Admin" },
                { value: "manager", label: "Manager" },
                { value: "viewer", label: "Viewer" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
