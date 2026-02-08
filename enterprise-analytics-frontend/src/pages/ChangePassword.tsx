import { Card, Form, Input, Button, message } from "antd";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const submit = async () => {
    const values = await form.validateFields();

    if (values.newPassword !== values.confirmPassword) {
      return message.error("Passwords do not match");
    }

    await api.post("/auth/change-password", {
      newPassword: values.newPassword,
    });

    message.success("Password updated");
    navigate("/");
  };

  return (
    <div className="flex justify-center mt-20">
      <Card title="Change Password" className="w-[350px]">
        <Form form={form} layout="vertical">
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" block onClick={submit}>
            Update Password
          </Button>
        </Form>
      </Card>
    </div>
  );
}
