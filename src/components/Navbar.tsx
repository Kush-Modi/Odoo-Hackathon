'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-[var(--surface)] shadow-sm border-b border-[var(--border-light)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold gradient-text">ReWear</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'text-[var(--primary)] bg-[var(--primary-light)] bg-opacity-10' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] hover:bg-opacity-5'
              }`}
            >
              Home
            </Link>
            
            {user ? (
              // Authenticated user links
              <>
                <Link 
                  href="/browse" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/browse') 
                      ? 'text-[var(--primary)] bg-[var(--primary-light)] bg-opacity-10' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] hover:bg-opacity-5'
                  }`}
                >
                  Browse
                </Link>
                <Link 
                  href="/dashboard" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard') 
                      ? 'text-[var(--primary)] bg-[var(--primary-light)] bg-opacity-10' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] hover:bg-opacity-5'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/add-item" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/add-item') 
                      ? 'text-[var(--primary)] bg-[var(--primary-light)] bg-opacity-10' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] hover:bg-opacity-5'
                  }`}
                >
                  Add Item
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--error)] text-white hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              // Non-authenticated user links
              <>
                <Link 
                  href="/login" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/login') 
                      ? 'text-[var(--primary)] bg-[var(--primary-light)] bg-opacity-10' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] hover:bg-opacity-5'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 rounded-lg text-sm font-medium btn-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 