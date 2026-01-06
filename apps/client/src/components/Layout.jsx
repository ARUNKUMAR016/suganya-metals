import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";

const SidebarItem = ({ to, icon, label, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center p-3 my-1 rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30"
          : "text-gray-300 hover:bg-gray-800/50 hover:text-white hover:translate-x-1"
      }`}
    >
      <span className="text-xl transform group-hover:scale-110 transition-transform duration-200">
        {icon}
      </span>
      {isOpen && (
        <span className="ml-3 font-medium whitespace-nowrap">{label}</span>
      )}
      {isActive && isOpen && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
      )}
    </Link>
  );
};

const DropdownSection = ({ title, icon, items, isOpen, isSidebarOpen }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const isAnyChildActive = items.some((item) => location.pathname === item.to);

  return (
    <div className="my-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
          isAnyChildActive
            ? "bg-blue-700/30 text-white border-l-4 border-blue-500"
            : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
        }`}
      >
        <div className="flex items-center">
          <span className="text-xl transform group-hover:scale-110 transition-transform duration-200">
            {icon}
          </span>
          {isSidebarOpen && (
            <span className="ml-3 font-semibold whitespace-nowrap">
              {title}
            </span>
          )}
        </div>
        {isSidebarOpen && (
          <span className="transform transition-transform duration-200">
            {isExpanded ? (
              <ChevronDown size={18} className="group-hover:translate-y-0.5" />
            ) : (
              <ChevronRight size={18} className="group-hover:translate-x-0.5" />
            )}
          </span>
        )}
      </button>

      {isExpanded && isSidebarOpen && (
        <div className="ml-6 mt-1 space-y-1 animate-slideDown">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center p-2 pl-3 rounded-lg transition-all duration-200 group border-l-2 ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-400 shadow-sm"
                    : "text-gray-400 hover:bg-gray-800/30 hover:text-white border-transparent hover:border-gray-600 hover:translate-x-1"
                }`}
              >
                <span className="text-sm transform group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="ml-2 text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const masterItems = [
    { to: "/roles", icon: "🛠️", label: t("roleMaster") },
    { to: "/labours", icon: "👷", label: t("labourMaster") },
    { to: "/products", icon: "📦", label: t("itemMaster") },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl border-r border-gray-700
          ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full lg:translate-x-0 lg:w-20"
          }
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 h-16 bg-gray-900/50">
          <div
            className={`transition-opacity duration-200 ${
              !isSidebarOpen && "lg:opacity-0 lg:hidden"
            }`}
          >
            <h1 className="text-lg font-bold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
              {t("companyName")}
            </h1>
          </div>

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-700/50 focus:outline-none transition-all duration-200 transform hover:scale-110 hidden lg:block"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isSidebarOpen
                    ? "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-700/50 focus:outline-none lg:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
          <SidebarItem
            to="/"
            icon="🏠"
            label={t("dashboard")}
            isOpen={isSidebarOpen}
          />

          <DropdownSection
            title={t("masters")}
            icon="📚"
            items={masterItems}
            isOpen={isSidebarOpen}
            isSidebarOpen={isSidebarOpen}
          />

          <div className="border-t border-gray-700/50 my-3"></div>

          <SidebarItem
            to="/production"
            icon="📝"
            label={t("dailyEntry")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            to="/salary"
            icon="💰"
            label={t("weeklySalary")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            to="/advances"
            icon="💸"
            label={t("advanceEntry")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            to="/advances/history"
            icon="📜"
            label={t("advanceHistory")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            to="/payments"
            icon="💳"
            label={t("payments")}
            isOpen={isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-gray-700/50 bg-gray-900/30">
          {isSidebarOpen && user && (
            <div className="mb-3 px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
              <p className="text-xs text-gray-400">{t("loggedInAs")}</p>
              <p className="text-sm text-white font-semibold truncate">
                {user.username}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <LogOut size={18} />
            {isSidebarOpen && (
              <span className="font-medium">{t("logout")}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 z-10 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-600 lg:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent truncate">
              {window.innerWidth < 640 ? t("companyName") : t("appTitle")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher /> {/* Add Switcher */}
            <div className="hidden sm:block px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-blue-200 shadow-lg transform hover:scale-110 transition-transform cursor-pointer">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Layout;
