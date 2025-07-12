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
    <div className="card group overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={displayImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-200">{title}</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2 leading-relaxed">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-[var(--primary)]">₹{price}</span>
          <span className="text-sm text-[var(--text-muted)] bg-[var(--surface-secondary)] px-3 py-1 rounded-full capitalize">{condition}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--text-secondary)] font-medium">Size: {size}</span>
          <Link 
            href={`/item/${id}`}
            className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-dark)] transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 