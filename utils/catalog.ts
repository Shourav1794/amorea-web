export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge: string;
  rating: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Authentic Lawn Embroidered 3-Piece',
    category: 'pakistani-wear',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    badge: 'Authentic Pakistani',
    rating: 5.0,
  },
  {
    id: 2,
    name: 'Luxury Chiffon Collection Velvet Suit',
    category: 'pakistani-wear',
    price: 12200,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    badge: 'Best Seller',
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Glow Essence Brightening Serum',
    category: 'skincare',
    price: 2450,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    badge: 'Imported',
    rating: 4.8,
  },
  {
    id: 4,
    name: 'Hydrating Night Repair Cream',
    category: 'skincare',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    badge: 'Organic',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Luxury Golden Chain Shoulder Bag',
    category: 'bags',
    price: 3950,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    badge: 'Exclusive',
    rating: 4.9,
  },
  {
    id: 6,
    name: 'Embroidered Premium Velvet Heels',
    category: 'footwear',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    badge: 'New Arrival',
    rating: 5.0,
  },
];
