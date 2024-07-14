import { useForm } from "@mantine/form";
import axios from "axios";
import { getUrl } from "../utils/getUrl";
import useChatId from "../hooks/useChatId";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { Tooltip } from "antd";

const LoginPage = ({ botName, params }: { botName: string; params: any }) => {
  const { chatId } = useChatId();
  const { login } = useAuth();
  const form = useForm({
    initialValues: {
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = async (data: {
    password: string;
    rememberMe: boolean;
  }) => {
    const res = await axios.post(`${getUrl().split("?")[0]}/login`, {
      password: data.password,
      user_id: chatId,
    });

    return res.data as { token: string };
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      login(data.token, form.values.rememberMe);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data.message || "An error occurred";
        form.setFieldError("password", message);
        return;
      }
      form.setFieldError("password", "An error occurred");
    },
  });

  return (
    <>
      <div className="flex justify-end mx-4 my-2">
        {params?.mode === "iframe" && params.no !== "button" && (
          <Tooltip title="Close">
            <button
              onClick={() => {
                window.parent.postMessage("db-iframe-close", "*");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          </Tooltip>
        )}
      </div>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mx-auto size-12 text-indigo-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>

            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {botName}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bot is protected, please enter the password to continue
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            onSubmit={form.onSubmit((values) => {
              mutate(values);
            })}
          >
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  form.errors.password
                    ? "border-red-300 ring-red-500"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                {...form.getInputProps("password")}
              />
              {form.errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {form.errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                {...form.getInputProps("rememberMe", {
                  type: "checkbox",
                })}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me for 7 days
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
