import api from "./axios";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const createUser = async (payload: {
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
}) => {
  const res = await api.post("/users", payload);
  return res.data;
};
