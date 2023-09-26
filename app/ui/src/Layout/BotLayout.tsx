import React, { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3BottomLeftIcon,
  XMarkIcon,
  CircleStackIcon,
  CogIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  EyeDropperIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {  Tooltip } from "antd";
import Avatar from "../components/Common/Avatar";

const navigation = [
  {
    name: "Playground",
    href: "/bot/:id",
    icon: SparklesIcon,
  },
  {
    name: "Data Sources",
    href: "/bot/:id/data-sources",
    icon: CircleStackIcon,
  },
  {
    name: "Integrations",
    href: "/bot/:id/integrations",
    icon: PuzzlePieceIcon,
  },
  {
    name: "Conversations",
    href: "/bot/:id/conversations",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: "Appearance",
    href: "/bot/:id/appearance",
    icon: EyeDropperIcon,
  },
  {
    name: "Settings",
    href: "/bot/:id/settings",
    icon: CogIcon,
  },
];

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BotLayout({
  children,
}: {
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { isLogged, profile, logout } = useAuth();

  React.useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged]);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <Link
                    to="/"
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center px-3"
                  >
                    <img
                      className="h-8 w-auto"
                      src="/logo.png"
                      alt="Dialoqbase"
                    />
                    <span className="ml-1 text-xl font-bold">Dialoqbase</span>
                    <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 ml-2">
                      {/* @ts-ignore */}
                      {`v${__APP_VERSION__}`}
                    </span>
                  </Link>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={{
                            pathname: item.href.replace(":id", params.id!),
                          }}
                          className={classNames(
                            location.pathname ===
                              item.href.replace(":id", params.id!)
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              location.pathname ===
                                item.href.replace(":id", params.id!)
                                ? "text-gray-500"
                                : "text-gray-400 group-hover:text-gray-500",
                              "mr-4 flex-shrink-0 h-6 w-6"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden md:fixed md:inset-y-0 md:flex md:flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
            <div className="mt-14 flex flex-grow flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {navigation.map((item) => (
                  <Tooltip placement="right" key={item.name} title={item.name}>
                    <Link
                      to={{
                        pathname: item.href.replace(":id", params.id!),
                      }}
                      className={classNames(
                        location.pathname ===
                          item.href.replace(":id", params.id!)
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group  flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          location.pathname ===
                            item.href.replace(":id", params.id!)
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500",
                          "flex-shrink-0 h-6 w-6"
                        )}
                        aria-hidden="true"
                      />
                      {/* {item.name} */}
                    </Link>
                  </Tooltip>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="sticky top-0 z-10 flex h-14  bg-white border-b border-gray-200 ">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Link
              to="/"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center px-3"
            >
              <img className="h-8 w-auto" src="/logo.png" alt="Dialoqbase" />
              <span className="ml-1 text-xl font-bold">Dialoqbase</span>
              <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 ml-2">
                {/* @ts-ignore */}
                {`v${__APP_VERSION__}`}
              </span>
            </Link>

            <div className="flex flex-1 justify-end px-4">
              <div className="ml-4 flex items-center md:ml-6">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm">
                      <span className="sr-only">Open usermenu</span>
                      <Avatar username={profile?.username || "admin"} />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                            to="/settings"
                          >
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
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
              </div>
            </div>
          </div>
          <main className="flex-1">
            {children}
            {/* <div className="py-4">
                  <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
                </div> */}
          </main>
        </div>
      </div>
    </>
  );
}
