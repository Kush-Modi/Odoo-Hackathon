'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import ProtectedRoute from '@/components/ProtectedRoute';

interface FormData {
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  tags: string;
  price: number;
}

export default function AddItem() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    tags: '',
    price: 0
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'tops', label: 'Tops' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'jackets', label: 'Jackets' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'bottoms', label: 'Bottoms' }
  ];

  const sizes = [
    { value: '', label: 'Select Size' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'One Size', label: 'One Size' }
  ];

  const conditions = [
    { value: '', label: 'Select Condition' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = selectedFiles.map(async (file, index) => {
      try {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to Cloudinary via API route
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64,
            folder: 'rewear-items',
            public_id: `item_${Date.now()}_${index}`
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        return result.secure_url;
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error(`Failed to upload image ${index + 1}`);
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!auth.currentUser) {
      setError('You must be logged in to add an item');
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.category || 
        !formData.size || !formData.condition || formData.price <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = auth.currentUser.uid;
      
      // Upload images to Cloudinary
      const imageUrls = await uploadImages();
      
      // Parse tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Create item document in Firestore
      const itemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        price: formData.price,
        tags: tagsArray,
        imageUrls: imageUrls,
        status: 'available',
        uploaderId: userId,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'items'), itemData);

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="max-w-md w-full text-center">
          <div className="card p-8">
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
              <p className="font-medium text-lg">Item listed successfully!</p>
              <p className="text-sm mt-2">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Add New Item</h1>
              <p className="text-xl text-[var(--text-secondary)]">List your pre-loved clothing for the ReWear community</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-[var(--error)]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  disabled={loading}
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="e.g., Vintage Denim Jacket"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  disabled={loading}
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="Describe the item's condition, style, and any notable features..."
                />
              </div>

              {/* Category and Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    disabled={loading}
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed text-[var(--text-primary)] bg-[var(--surface)]"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                    Size *
                  </label>
                  <select
                    id="size"
                    name="size"
                    required
                    disabled={loading}
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed text-[var(--text-primary)] bg-[var(--surface)]"
                  >
                    {sizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Condition and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    required
                    disabled={loading}
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed text-[var(--text-primary)] bg-[var(--surface)]"
                  >
                    {conditions.map((condition) => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    disabled={loading}
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  disabled={loading}
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="vintage, denim, casual (comma-separated)"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  Images *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={loading}
                  onChange={handleFileSelect}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed text-[var(--text-primary)]"
                />
                <p className="text-sm text-[var(--text-muted)] mt-2">Select one or more images of your item</p>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                    Selected Images ({selectedFiles.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-[var(--border-light)] group-hover:border-[var(--primary)] transition-colors duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-[var(--error)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition-colors duration-200 shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Item...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 