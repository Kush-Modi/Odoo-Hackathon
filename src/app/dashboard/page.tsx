'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - will be replaced with Firebase data
  const userStats = {
    itemsListed: 12,
    itemsSold: 8,
    totalEarnings: 240,
    itemsBought: 5
  };

  const recentItems = [
    {
      id: '1',
      title: 'Vintage Denim Jacket',
      description: 'Classic 90s denim jacket in excellent condition',
      price: 45,
      condition: 'excellent',
      size: 'M'
    },
    {
      id: '2',
      title: 'Summer Dress',
      description: 'Light floral summer dress perfect for warm days',
      price: 25,
      condition: 'good',
      size: 'S'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Dashboard</h1>
            <p className="text-xl text-[var(--text-secondary)]">Welcome back! Here's what's happening with your account.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Items Listed</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{userStats.itemsListed}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[var(--success)] to-green-500 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Items Sold</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{userStats.itemsSold}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Total Earnings</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">₹{userStats.totalEarnings}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Items Bought</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{userStats.itemsBought}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="border-b border-[var(--border-light)]">
              <nav className="-mb-px flex space-x-8 px-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'overview'
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)]'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('my-items')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'my-items'
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)]'
                  }`}
                >
                  My Items
                </button>
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'purchases'
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)]'
                  }`}
                >
                  Purchases
                </button>
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentItems.map((item) => (
                      <div key={item.id} className="border border-[var(--border-light)] rounded-lg p-6 hover:border-[var(--primary)] transition-colors duration-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-[var(--text-primary)] text-lg">{item.title}</h4>
                            <p className="text-[var(--text-secondary)] mt-2">{item.description}</p>
                            <div className="flex items-center space-x-6 mt-3">
                              <span className="text-sm text-[var(--text-muted)]">Size: {item.size}</span>
                              <span className="text-sm text-[var(--text-muted)] capitalize">Condition: {item.condition}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-[var(--primary)]">₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'my-items' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">My Listed Items</h3>
                    <Link href="/add-item" className="btn-primary">
                      Add New Item
                    </Link>
                  </div>
                  <p className="text-[var(--text-secondary)] text-lg">No items listed yet. Start by adding your first item!</p>
                </div>
              )}

              {activeTab === 'purchases' && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">My Purchases</h3>
                  <p className="text-[var(--text-secondary)] text-lg">No purchases yet. Start browsing items!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 