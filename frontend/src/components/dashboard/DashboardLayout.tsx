"use client";

import { authKey } from "@/constants/storage";
import { getUserInfo, removeUserInfo } from "@/utils/auth";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Navbar from "../Navbar";

interface UserInfo {
  sub: string;
  role: "ADMIN" | "USER" | "PROJECT_MANAGER";
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
}

const baseNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    roles: ["ADMIN", "USER", "PROJECT_MANAGER"],
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderIcon,
    roles: ["ADMIN", "USER", "PROJECT_MANAGER"],
  },
  {
    name: "Tasks",
    href: "/dashboard/tasks",
    icon: CalendarIcon,
    roles: ["ADMIN", "USER", "PROJECT_MANAGER"],
  },
];

const adminNavigation = [
  {
    name: "User Management",
    href: "/dashboard/users",
    icon: UserPlusIcon,
    roles: ["ADMIN"],
  },
];

const projectManagerNavigation = [
  {
    name: "Team Management",
    href: "/dashboard/team",
    icon: UserGroupIcon,
    roles: ["PROJECT_MANAGER"],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { role } = getUserInfo() as UserInfo;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      removeUserInfo(authKey);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getNavigationItems = () => {
    const allNavigation = [
      ...baseNavigation,
      ...adminNavigation,
      ...projectManagerNavigation,
    ];
    return allNavigation.filter((item) => item.roles.includes(role));
  };

  const navigation = getNavigationItems();

  return (
    <div>
      <Navbar />
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
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
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link
                      href="/dashboard"
                      className="text-xl font-bold text-primary-600"
                    >
                      ProjectHub
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {mounted &&
                            navigation.map((item: NavigationItem) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    pathname === item.href
                                      ? "bg-gray-50 text-primary-600"
                                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      pathname === item.href
                                        ? "text-primary-600"
                                        : "text-gray-400 group-hover:text-primary-600",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        {mounted && (
                          <button
                            onClick={handleLogout}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                          >
                            <XMarkIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600"
                              aria-hidden="true"
                            />
                            Logout
                          </button>
                        )}
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-primary-600"
            >
              ProjectHub
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {mounted &&
                    navigation.map((item: NavigationItem) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            pathname === item.href
                              ? "bg-gray-50 text-primary-600"
                              : "text-gray-700 hover:text-primary-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              pathname === item.href
                                ? "text-primary-600"
                                : "text-gray-400 group-hover:text-primary-600",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
              <li className="mt-auto">
                {mounted && (
                  <button
                    onClick={handleLogout}
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  >
                    <XMarkIcon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600"
                      aria-hidden="true"
                    />
                    Logout
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
