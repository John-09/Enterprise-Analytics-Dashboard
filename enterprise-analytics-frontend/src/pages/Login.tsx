import { Button, Form, Input, Card } from "antd";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    const data = await login(values);
    dispatch(loginSuccess(data));
    navigate("/");
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <Card title="Login" className="w-[350px]">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" required>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" required>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
