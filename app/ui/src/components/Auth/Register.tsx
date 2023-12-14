import { Form, Input, notification } from "antd";
import api from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../hooks/useSettings";
interface User {
  user_id: number;
  username: string;
  email: string;
}

interface RegisterResponse {
  message: string;
  token: string;
  user: User;
  to: string;
}

export const AuthRegister = () => {
  const navigate = useNavigate();
  const onRegister = async (values: any) => {
    const response = await api.post("/user/register", values);
    return response.data as RegisterResponse;
  };

  const { login } = useAuth();

  const { data: info } = useSettings();

  const { mutateAsync: registerMutation, isLoading } = useMutation(onRegister, {
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
        return;
      }

      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  return (
    <>
      {" "}
      <div className="flex min-h-full bg-white flex-1 dark:bg-black">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <div className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center">
                <img className="h-8 w-auto" src="/logo.png" alt="Dialoqbase" />
                <span className="text-lg font-bold dark:text-white">
                  Dialoqbase
                </span>
                <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 ml-2">
                  {/* @ts-ignore */}
                  {`v${__APP_VERSION__}`}
                </span>
              </div>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                Create an account
              </h2>
            </div>

            <div className="mt-10">
              <div>
                <Form
                  layout="vertical"
                  className="space-y-6"
                  onFinish={registerMutation}
                  requiredMark={false}
                >
                  {" "}
                  <Form.Item
                    name="username"
                    label={"Username"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      autoComplete="username"
                      placeholder="Username"
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label={"Email"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your email",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label={"Password"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      autoComplete="current-password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || !info?.isRegistrationAllowed}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Loading..." : "Register"}
                    </button>
                  </div>
                </Form>
              </div>
              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute h-full w-full object-cover rounded-sm bg-gradient-to-r from-sky-400 to-blue-500 dark:from-sky-900 dark:to-gray-900"></div>
        </div>
      </div>
    </>
  );
};
