import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storeApi } from '../../api/storeApi';
import { ratingApi } from '../../api/ratingApi';
import { UserRole } from '../../types';
import { Store as StoreIcon, Star, LogOut } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      loadStores();
      loadUserRatings();
    }
  }, [user]);

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

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    try {
      await ratingApi.upsert({ storeId, rating });
      setUserRatings(prev => ({ ...prev, [storeId]: rating }));
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
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
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
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

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Rating
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
                            >
                              <Star className="h-5 w-5" />
                            </button>
                          ))}
                        </div>
                        {userRatings[store.id] && (
                          <p className="mt-2 text-sm text-gray-600">
                            You rated this store {userRatings[store.id]} stars
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
