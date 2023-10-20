import {
  CubeIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { Link, useLocation } from "react-router-dom";
import { AiIcon } from "../components/Icons/AiIcon";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LinkComponent = (item: {
  href: string;
  name: string;
  icon: any;
  current: string;
}) => {
  return (
    <li>
      <Link
        to={item.href}
        className={classNames(
          item.current === item.href
            ? "bg-gray-100 text-indigo-600"
            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100",
          "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold"
        )}
      >
        <item.icon
          className={classNames(
            item.current === item.href
              ? "text-indigo-600"
              : "text-gray-400 group-hover:text-indigo-600",
            "h-6 w-6 shrink-0"
          )}
          aria-hidden="true"
        />
        {item.name}
      </Link>
    </li>
  );
};

export const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: adminInfo } = useIsAdmin();
  const location = useLocation();
  return (
    <>
      <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
        {adminInfo?.is_admin && (
          <aside className="flex lg:rounded-md bg-white lg:h-52 lg:p-4 lg:mt-20 overflow-x-auto lg:border border-b  py-4 lg:block lg:w-64 lg:flex-none  ">
            <nav className="flex-none  px-4 sm:px-6 lg:px-0">
              <ul
                role="list"
                className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
              >
                <LinkComponent
                  href="/settings"
                  name="General"
                  icon={UserCircleIcon}
                  current={location.pathname}
                />
                <LinkComponent
                  href="/settings/application"
                  name="Application"
                  icon={CubeIcon}
                  current={location.pathname}
                />

                <LinkComponent
                  href="/settings/teams"
                  name="Teams"
                  icon={UsersIcon}
                  current={location.pathname}
                />

                <LinkComponent
                  href="/settings/model"
                  name="Model"
                  current={location.pathname}
                  icon={AiIcon}
                />
              </ul>
            </nav>
          </aside>
        )}

        <main
          className={
            adminInfo?.is_admin
              ? "px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20"
              : "px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20 lg:mx-auto lg:max-w-2xl"
          }
        >
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-10 lg:mx-0 lg:max-w-none">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};
