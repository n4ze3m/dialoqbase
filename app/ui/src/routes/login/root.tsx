import { Form, notification } from "antd";
import api from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
interface User {
  user_id: number;
  username: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: User;
  to: string;
}

export default function LoginRoot() {
  const navigate = useNavigate();
  const onLogin = async (values: any) => {
    const response = await api.post("/user/login", values);
    return response.data as LoginResponse;
  };

  const { login } = useAuth();

  const {
    mutateAsync: loginMutation,
    isLoading,
  } = useMutation(onLogin, {
    onSuccess: (data) => {
      notification.success({
        message: "Success",
        description: data.message,
        placement: "bottomRight",
      });
      login(data.token, data.user);
      navigate(data.to);
    },
    onError: (error) => {
      // is axios
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        notification.error({
          message: "Error",
          description: message,
          placement: "bottomRight",
        });
        return
      }

      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://em-content.zobj.net/thumbs/120/openmoji/338/high-voltage_26a1.png"
            alt="dialoqbase"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form
              layout="vertical"
              className="space-y-6"
              onFinish={loginMutation}
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <div className="mt-1">
                  <input
                    autoComplete="username"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </Form.Item>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {
                    isLoading ? "Loading..." : "Sign in"
                  }
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
