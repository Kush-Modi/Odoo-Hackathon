'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import ItemCard from '@/components/ItemCard';
import Link from 'next/link';

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  size: string;
  imageUrls: string[];
  status: string;
  createdAt: any;
}

export default function Home() {
  const [latestItems, setLatestItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatestItems = async () => {
      try {
        setLoading(true);
        const itemsRef = collection(db, 'items');
        const q = query(
          itemsRef,
          where('status', '==', 'available'),
          limit(6)
        );
        
        const querySnapshot = await getDocs(q);
        const items: Item[] = [];
        
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          } as Item);
        });
        
        setLatestItems(items);
      } catch (err) {
        console.error('Error fetching latest items:', err);
        setError('Failed to load latest items');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestItems();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Welcome to ReWear
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-95 leading-relaxed">
              The sustainable way to exchange and discover pre-loved clothing
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/browse" className="bg-white text-[var(--primary)] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Browsing
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[var(--primary)] transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-[var(--text-primary)]">
            Why Choose ReWear?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Sustainable Fashion</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">Give pre-loved clothing a second life and reduce fashion waste</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Affordable Style</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">Find quality clothing at a fraction of retail prices</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Community Driven</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">Connect with like-minded individuals who value sustainable fashion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Items Section */}
      <section className="py-20 bg-[var(--surface-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6">
              Latest Items
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Discover the newest additions to our sustainable fashion community
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary)]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-[var(--error)] text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-6 text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium"
              >
                Try again
              </button>
            </div>
          ) : latestItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestItems.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.imageUrls?.[0] || '/placeholder-item.jpg'}
                  price={item.price}
                  condition={item.condition}
                  size={item.size}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[var(--text-muted)] text-lg">No items available at the moment</p>
            </div>
          )}

          {latestItems.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                href="/browse" 
                className="btn-primary text-lg px-8 py-4"
              >
                View All Items
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-[var(--text-primary)]">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-[var(--text-secondary)] mb-10 leading-relaxed">
            Join thousands of users who are already making a difference
          </p>
          <Link 
            href="/register" 
            className="btn-primary text-lg px-10 py-4"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
