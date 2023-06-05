import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { ChevronRightIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Empty } from "antd";

export const DashboardGrid = () => {

  const { data, status } = useQuery(["getAllBots"], async () => {
    const response = await api.get("/bot");
    return response.data;
  });

  return (
    <>
      {status === "loading" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* create skelon loadinf */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              className="flex rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
              key={item}
            >
              <div className="flex flex-1  items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-4 text-sm">
                  <h3 className="animate-pulse h-4 bg-gray-400 font-medium text-gray-900 hover:text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {status === "success" && data.length === 0 && <Empty />}
      {status === "success" && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {data.map((bot: any) => (
            <Link
              to={`/bot/${bot.id}`}
              className="flex rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
              key={bot.id}
            >
              <div className="flex flex-1  items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-4 text-sm">
                  <h3 className="font-medium text-gray-900 hover:text-gray-600">
                    {bot.name}
                  </h3>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open options</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Something went wrong
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
