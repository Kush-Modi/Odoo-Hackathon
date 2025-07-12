'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  price: number;
  tags: string[];
  imageUrls: string[];
  status: string;
  uploaderId: string;
  createdAt: any;
}

export default function ItemDetail() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      if (!params.id) {
        setError('Item ID not found');
        setLoading(false);
        return;
      }

      try {
        const itemId = params.id as string;
        const itemDoc = await getDoc(doc(db, 'items', itemId));
        
        if (!itemDoc.exists()) {
          setError('Item not found');
          setLoading(false);
          return;
        }

        const itemData = itemDoc.data() as Omit<Item, 'id'>;
        setItem({
          id: itemDoc.id,
          ...itemData
        });
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.id]);

  const handleRequestSwap = async () => {
    if (!user || !item) return;

    setActionLoading(true);
    try {
      // Update item status to pending
      await updateDoc(doc(db, 'items', item.id), {
        status: 'pending'
      });

      // Update local state
      setItem(prev => prev ? { ...prev, status: 'pending' } : null);

      // Show success message
      alert('Swap request sent!');
    } catch (err) {
      console.error('Error requesting swap:', err);
      alert('Failed to send swap request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (!user || !item) return;

    setActionLoading(true);
    try {
      // Update item status to swapped
      await updateDoc(doc(db, 'items', item.id), {
        status: 'swapped'
      });

      // Update local state
      setItem(prev => prev ? { ...prev, status: 'swapped' } : null);

      // Show success message
      alert('Item redeemed with points!');
    } catch (err) {
      console.error('Error redeeming points:', err);
      alert('Failed to redeem item. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date not available';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { text: 'Available', color: 'bg-green-100 text-green-800' },
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      swapped: { text: 'Swapped', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/browse')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {item.imageUrls.length > 0 ? (
                  <img
                    src={item.imageUrls[selectedImage]}
                    alt={item.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {item.imageUrls.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {item.imageUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`${item.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(item.status)}
                    <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                  </div>
                </div>
              </div>

              {/* Item Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Item Details</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="text-sm text-gray-900 capitalize">{item.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Size</dt>
                      <dd className="text-sm text-gray-900">{item.size}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Condition</dt>
                      <dd className="text-sm text-gray-900 capitalize">{item.condition}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Uploader</dt>
                      <dd className="text-sm text-gray-900">{item.uploaderId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Listed</dt>
                      <dd className="text-sm text-gray-900">{formatDate(item.createdAt)}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {item.status === 'available' && user && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleRequestSwap}
                      disabled={actionLoading}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading ? 'Processing...' : 'Request Swap'}
                    </button>
                    <button
                      onClick={handleRedeemPoints}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading ? 'Processing...' : 'Redeem with Points'}
                    </button>
                  </div>
                </div>
              )}

              {item.status === 'available' && !user && (
                <div className="border-t pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-blue-800 text-sm">
                      Please log in to request a swap or redeem this item with points.
                    </p>
                    <button
                      onClick={() => router.push('/login')}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Log In
                    </button>
                  </div>
                </div>
              )}

              {item.status !== 'available' && (
                <div className="border-t pt-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <p className="text-gray-600 text-sm">
                      This item is no longer available for swap or redemption.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 