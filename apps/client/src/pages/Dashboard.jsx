import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Package,
  Briefcase,
  CreditCard,
  Plus,
  ArrowUpRight,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  onClick,
}) => (
  <div
    className={`relative bg-gradient-to-br ${gradient} rounded-2xl shadow-lg hover:shadow-2xl p-6 cursor-pointer transform hover:-translate-y-2 active:scale-95 transition-all duration-300 group overflow-hidden`}
    onClick={onClick}
  >
    {/* Decorative circles */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-3xl font-bold mb-1 tracking-tight">
            {value}
          </p>
          <p className="text-white/70 text-xs">{subtitle}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
          <Icon size={24} className="text-white" />
        </div>
      </div>

      {onClick && (
        <div className="flex items-center gap-1 text-white/90 text-sm font-medium group-hover:gap-2 transition-all">
          <span>View details</span>
          <ArrowUpRight
            size={16}
            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
        </div>
      )}
    </div>
  </div>
);

const ResourceCard = ({ icon: Icon, label, count, color, onClick }) => (
  <div
    className={`flex items-center justify-between p-4 bg-gradient-to-br ${color} rounded-xl cursor-pointer hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 group`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg group-hover:scale-110 transition-transform">
        <Icon size={20} className="text-white" />
      </div>
      <span className="font-semibold text-white">{label}</span>
    </div>
    <span className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">
      {count}
    </span>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-saffron via-kumkum to-dark-brown bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-dark-brown/70 mt-1">
            Welcome back! Here's your overview
          </p>
        </div>
        <button
          onClick={() => navigate("/production")}
          className="bg-gradient-to-r from-saffron to-kumkum hover:from-orange-500 hover:to-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-semibold border border-gold/20"
        >
          <Plus size={20} />
          Record Production
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Production"
          value={`${stats?.today?.totalKg || 0} kg`}
          subtitle={`${stats?.today?.labours || 0} labours worked today`}
          icon={TrendingUp}
          gradient="from-saffron to-orange-500"
          onClick={() => navigate("/production")}
        />
        <StatCard
          title="Today's Amount"
          value={`₹${stats?.today?.totalAmount || 0}`}
          subtitle="Estimated earnings today"
          icon={DollarSign}
          gradient="from-emerald-600 to-emerald-500"
        />
        <StatCard
          title="This Week"
          value={`${stats?.week?.totalKg || 0} kg`}
          subtitle={`${stats?.week?.days || 0} days with production`}
          icon={Calendar}
          gradient="from-purple-700 to-indigo-600"
          onClick={() => navigate("/salary")}
        />
        <StatCard
          title="Week Salary"
          value={`₹${stats?.week?.totalAmount || 0}`}
          subtitle="Total payable this week"
          icon={CreditCard}
          gradient="from-kumkum to-red-600"
          onClick={() => navigate("/salary")}
        />
      </div>

      {/* Resources & Payments Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Active Resources */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <Briefcase size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Active Resources
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResourceCard
              icon={Users}
              label="Labours"
              count={stats?.resources?.activeLabours || 0}
              color="from-blue-500 to-blue-600"
              onClick={() => navigate("/labours")}
            />
            <ResourceCard
              icon={Briefcase}
              label="Roles"
              count={stats?.resources?.activeRoles || 0}
              color="from-purple-500 to-purple-600"
              onClick={() => navigate("/roles")}
            />
            <ResourceCard
              icon={Package}
              label="Items"
              count={stats?.resources?.totalProducts || 0}
              color="from-green-500 to-green-600"
              onClick={() => navigate("/products")}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
