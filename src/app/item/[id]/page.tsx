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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary)] mx-auto mb-6"></div>
          <p className="text-[var(--text-secondary)] text-lg">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Item Not Found</h2>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => router.push('/browse')}
            className="btn-primary"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card overflow-hidden">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 bg-[var(--surface-secondary)]">
                {item.imageUrls.length > 0 ? (
                  <img
                    src={item.imageUrls[selectedImage]}
                    alt={item.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-[var(--surface-secondary)]">
                    <p className="text-[var(--text-muted)]">No image available</p>
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
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImage === index ? 'border-[var(--primary)] shadow-lg' : 'border-[var(--border)] hover:border-[var(--primary-light)]'
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
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">{item.title}</h1>
                  <div className="flex items-center space-x-6">
                    {getStatusBadge(item.status)}
                    <span className="text-3xl font-bold text-[var(--primary)]">₹{item.price}</span>
                  </div>
                </div>
              </div>

              {/* Item Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Item Details</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-[var(--text-secondary)]">Category</dt>
                      <dd className="text-base text-[var(--text-primary)] capitalize">{item.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-[var(--text-secondary)]">Size</dt>
                      <dd className="text-base text-[var(--text-primary)]">{item.size}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-[var(--text-secondary)]">Condition</dt>
                      <dd className="text-base text-[var(--text-primary)] capitalize">{item.condition}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-[var(--text-secondary)]">Uploader</dt>
                      <dd className="text-base text-[var(--text-primary)]">{item.uploaderId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-[var(--text-secondary)]">Listed</dt>
                      <dd className="text-base text-[var(--text-primary)]">{formatDate(item.createdAt)}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Description</h3>
                  <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">{item.description}</p>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--primary-light)] bg-opacity-10 text-[var(--primary)]"
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
                <div className="border-t border-[var(--border-light)] pt-8">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Actions</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleRequestSwap}
                      disabled={actionLoading}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Processing...' : 'Request Swap'}
                    </button>
                    <button
                      onClick={handleRedeemPoints}
                      disabled={actionLoading}
                      className="flex-1 bg-[var(--success)] text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {actionLoading ? 'Processing...' : 'Redeem with Points'}
                    </button>
                  </div>
                </div>
              )}

              {item.status === 'available' && !user && (
                <div className="border-t border-[var(--border-light)] pt-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-blue-800 text-base">
                      Please log in to request a swap or redeem this item with points.
                    </p>
                    <button
                      onClick={() => router.push('/login')}
                      className="mt-4 btn-primary"
                    >
                      Log In
                    </button>
                  </div>
                </div>
              )}

              {item.status !== 'available' && (
                <div className="border-t border-[var(--border-light)] pt-8">
                  <div className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg p-6">
                    <p className="text-[var(--text-secondary)] text-base">
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