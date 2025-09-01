import React, { useState, useEffect } from 'react';
import { storeApi } from '../../api/storeApi';
import { Store } from '../../types';
import { Trash2, Search, Star, ArrowUpDown } from 'lucide-react';

interface StoresListProps {
  onStoreCreated: () => void;
}

const StoresList: React.FC<StoresListProps> = ({ onStoreCreated }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadStores();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storeApi.getAll(currentPage, 10, searchTerm, sortBy, sortOrder);
      setStores(response.data);
      setTotalPages(Math.ceil(response.meta.total / response.meta.limit));
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await storeApi.delete(storeId);
        loadStores();
        onStoreCreated();
      } catch (error) {
        console.error('Error deleting store:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Stores Management</h2>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="block w-32 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="name">Name</option>
          <option value="averageRating">Rating</option>
          <option value="createdAt">Created</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
          className="block w-24 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {stores.map((store) => (
              <li key={store.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{store.name}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">
                            {store.averageRating.toFixed(1)} ({store.totalRatings})
                          </span>
                        </div>
                      </div>
                    </div>
                    {store.address && (
                      <p className="mt-1 text-sm text-gray-500">{store.address}</p>
                    )}
                    {store.owner && (
                      <p className="mt-1 text-sm text-gray-500">
                        Owner: {store.owner.name} ({store.owner.email})
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      Created: {new Date(store.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteStore(store.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete store"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StoresList;
