import { Menu } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Common/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useDarkMode } from "../hooks/useDarkmode";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const ApplicationMenu = () => {
  const { profile, logout } = useAuth();
  const { mode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm dark:bg-black">
          <span className="sr-only">Open user menu</span>
          <Avatar username={profile?.username || "admin"} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:border dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          <Menu.Item>
            {({ active }) => (
              <Link
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-800 "
                )}
                to="/settings"
              >
                Settings
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                )}
                onClick={() => {
                  toggleDarkMode();
                }}
              >
                <span className="flex items-center">
                  {mode === "dark" ? (
                    <SunIcon className="w-5 h-5 mr-2" />
                  ) : (
                    <MoonIcon className="w-5 h-5 mr-2" />
                  )}
                  {mode === "dark" ? "Light mode" : "Dark mode"}
                </span>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <span
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-red-700 dark:text-red-600 cursor-pointer dark:hover:bg-gray-800"
                )}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Sign out
              </span>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
