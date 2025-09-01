import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../api/userApi";
import { storeApi } from "../../api/storeApi";
import { ratingApi } from "../../api/ratingApi";
import { UserRole } from "../../types";
import { Users, Store, Star, LogOut } from "lucide-react";
import UsersList from "./UsersList";
import StoresList from "./StoresList";
import CreateUserModal from "./CreateUserModal";

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "stores">(
    "overview"
  );
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [userCount, storeCount, ratingCount] = await Promise.all([
        userApi.getCount(),
        storeApi.getCount(),
        ratingApi.getCount(),
      ]);
      setStats({
        totalUsers: (userCount.byRole.USER || 0) + (userCount.byRole.ADMIN || 0),
        totalStores: storeCount.total,
        totalRatings: ratingCount.total,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  if (user?.role !== UserRole.ADMIN) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 ${
                  isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoggingOut ? (
                  <svg
                    className="animate-spin h-4 w-4 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("stores")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "stores"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Stores
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Users
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.totalUsers}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Store className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Stores
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.totalStores}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Star className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Ratings
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.totalRatings}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowCreateUser(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && <UsersList onUserCreated={loadStats} />}

          {activeTab === "stores" && <StoresList onStoreCreated={loadStats} />}
        </div>
      </div>

      {showCreateUser && (
        <CreateUserModal
          onClose={() => setShowCreateUser(false)}
          onUserCreated={() => {
            setShowCreateUser(false);
            loadStats();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
