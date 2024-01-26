import React from "react";
import { useDarkMode } from "../../../hooks/useDarkmode";
import { Link } from "react-router-dom";

type Prosp = {
  href?: string;
  onClick?: () => void;
  logo: string;
  name: string;
  color: string;
  textColor: string;
  status?: string;
  description: string;
};

export const IntegrationCard: React.FC<Prosp> = ({
  href,
  onClick,
  logo,
  name,
  color,
  textColor,
  status,
  description,
}) => {
  const { mode } = useDarkMode();

  return !href ? (
    <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer dark:bg-[#0a0a0a] dark:border-[#232222]  dark:hover:bg-[#1a1a1a] dark:hover:border-[#232222] hover:bg-gray-50">
      <button
        // onClick={() => {
        //   setSelectedIntegration(integration);
        //   setOpen(true);
        // }}
        onClick={onClick}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <img className="h-12 w-auto" src={logo} alt={name} />
            <div className="ml-2 flex flex-shrink-0">
              <p
                className={`inline-flex rounded-md px-2 text-sm  leading-5 border border-transparent uppercase tracking-widest dark:bg-[#232222] dark:text-[#fff] dark:border-[#232222] dark:hover:bg-[#232222] dark:hover:text-[#fff] dark:hover:border-[#232222]
              `}
                style={{
                  backgroundColor: mode !== "dark" ? color : undefined,
                  color: mode !== "dark" ? textColor : undefined,
                  borderColor:
                    mode !== "dark"
                      ? color !== "#fff"
                        ? color
                        : "#000"
                      : undefined,
                }}
              >
                {status}
              </p>
            </div>
          </div>
        </div>
        <div className="sm:flex sm:items-center">
          <div className="text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </button>
    </div>
  ) : (
    <Link
      to={href}
      className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer dark:bg-[#0a0a0a] dark:border-[#232222]  dark:hover:bg-[#1a1a1a] dark:hover:border-[#232222] hover:bg-gray-50"
    >
      <div>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <img className="h-12 w-auto" src={logo} alt={name} />
          </div>
        </div>
        <div className="sm:flex sm:items-center">
          <div className="text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
