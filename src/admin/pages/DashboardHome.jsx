import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Users, ShoppingCart, TrendingUp, DollarSign, Activity } from "lucide-react";

const StatCard = ({ title, value, change, icon: Icon, color, delay }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    emerald: "from-emerald-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-amber-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <p className={`text-sm mt-2 font-medium ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats] = useState({
    products: 156,
    users: 234,
    orders: 89,
    revenue: 45678
  });

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.products}
          change={12}
          icon={Package}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Total Users"
          value={stats.users}
          change={8}
          icon={Users}
          color="purple"
          delay={0.1}
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          change={-3}
          icon={ShoppingCart}
          color="emerald"
          delay={0.2}
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          change={24}
          icon={DollarSign}
          color="orange"
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Activity Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {[
              { text: "New order #1234 placed", time: "2 min ago" },
              { text: "Product 'iPhone 15' updated", time: "15 min ago" },
              { text: "New user registered", time: "1 hour ago" },
              { text: "Order #1230 completed", time: "2 hours ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Today's Orders</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">24</span>
              </div>
              <div className="w-full h-2 mt-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">3.2%</span>
              </div>
              <div className="w-full h-2 mt-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">18</span>
              </div>
              <div className="w-full h-2 mt-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;