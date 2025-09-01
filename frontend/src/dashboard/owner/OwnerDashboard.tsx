import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storeApi } from '../../api/storeApi';
import { ratingApi } from '../../api/ratingApi';
import { UserRole } from '../../types';
import { Store, Star, LogOut, Users, Key } from 'lucide-react';
import UpdatePasswordModal from '../user/UpdatePasswordModal';

const OwnerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [store, setStore] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      loadStoreData();
    }
  }, [user]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const stores = await storeApi.getAll(1, 100);
      const userStore = stores.data.find((s: any) => s.owner?.id === user?.id);
      
      if (userStore) {
        setStore(userStore);
        const storeRatings = await ratingApi.getStoreRatings(userStore.id, 1, 100);
        setRatings(storeRatings.data);
      }
    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const handlePasswordUpdateSuccess = () => {
    alert('Password updated successfully!');
  };

  if (user?.role !== UserRole.STORE_OWNER) {
    return <div>Access denied</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Store Found</h2>
          <p className="text-gray-600">You don't have a store assigned yet. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Store Owner Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={() => setShowUpdatePasswordModal(true)}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <Key className="h-4 w-4" />
                <span>Update Password</span>
              </button>
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Store className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Store Name</dt>
                      <dd className="text-lg font-medium text-gray-900">{store.name}</dd>
                      {store.address && (
                        <>
                          <dt className="text-sm font-medium text-gray-500 truncate mt-2">Address</dt>
                          <dd className="text-sm text-gray-900">{store.address}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {store.averageRating.toFixed(1)} / 5.0
                      </dd>
                      <dt className="text-sm font-medium text-gray-500 truncate mt-2">Total Ratings</dt>
                      <dd className="text-lg font-medium text-gray-900">{store.totalRatings}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Ratings
                </h3>
                
                {ratings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No ratings yet</p>
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ratings.map((rating) => (
                          <tr key={rating.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {rating.user?.name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {rating.user?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900 mr-2">
                                  {rating.rating}
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < rating.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdatePasswordModal
        isOpen={showUpdatePasswordModal}
        onClose={() => setShowUpdatePasswordModal(false)}
        onSuccess={handlePasswordUpdateSuccess}
      />
    </div>
  );
};

export default OwnerDashboard;
