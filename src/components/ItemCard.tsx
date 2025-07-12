import Image from 'next/image';
import Link from 'next/link';

interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageUrls?: string[];
  price: number;
  condition: string;
  size: string;
}

export default function ItemCard({ id, title, description, imageUrl, imageUrls, price, condition, size }: ItemCardProps) {
  const displayImage = imageUrl || imageUrls?.[0] || '/placeholder-item.jpg';
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={displayImage}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-blue-600">${price}</span>
          <span className="text-sm text-gray-500 capitalize">{condition}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Size: {size}</span>
          <Link 
            href={`/item/${id}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 