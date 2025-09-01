import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storeApi } from '../../api/storeApi';
import { ratingApi } from '../../api/ratingApi';
import { UserRole } from '../../types';
import { Store as StoreIcon, Star, LogOut, Key, Search } from 'lucide-react';
import UpdatePasswordModal from './UpdatePasswordModal';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [filteredStores, setFilteredStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  useEffect(() => {
    if (user) {
      loadStores();
      loadUserRatings();
    }
  }, [user]);

  useEffect(() => {
    filterStores();
  }, [stores, searchTerm]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storeApi.getAll(1, 100);
      setStores(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRatings = async () => {
    try {
      const response = await ratingApi.getUserRatings(user!.id, 1, 100);
      const ratingsMap: Record<string, number> = {};
      response.data.forEach((rating: any) => {
        ratingsMap[rating.store.id] = rating.rating;
      });
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Error loading user ratings:', error);
    }
  };

  const filterStores = () => {
    if (!searchTerm.trim()) {
      setFilteredStores(stores);
      return;
    }

    const filtered = stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.address && store.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredStores(filtered);
  };

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    try {
      await ratingApi.upsert({ storeId, rating });
      setUserRatings(prev => ({ ...prev, [storeId]: rating }));
      loadStores();
    } catch (error) {
      console.error('Error submitting rating:', error);
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

  if (user?.role !== UserRole.USER) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">User Dashboard</h1>
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
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stores by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredStores.length} of {stores.length} stores
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStores.map((store) => (
                  <div key={store.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <StoreIcon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{store.name}</h3>
                          {store.address && (
                            <p className="mt-1 text-sm text-gray-500">{store.address}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Overall Rating
                          </label>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.round(store.averageRating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {store.averageRating.toFixed(1)} ({store.totalRatings} ratings)
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {userRatings[store.id] ? 'Your Rating (click to modify)' : 'Rate this store'}
                          </label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => handleRatingSubmit(store.id, rating)}
                                className={`p-2 rounded-full transition-colors ${
                                  userRatings[store.id] === rating
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                                title={`Rate ${rating} star${rating > 1 ? 's' : ''}`}
                              >
                                <Star className="h-5 w-5" />
                              </button>
                            ))}
                          </div>
                          {userRatings[store.id] && (
                            <p className="mt-2 text-sm text-green-600">
                              You rated this store {userRatings[store.id]} star{userRatings[store.id] > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredStores.length === 0 && searchTerm && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No stores found matching "{searchTerm}"</p>
                </div>
              )}
            </>
          )}
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

export default UserDashboard;
