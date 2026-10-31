'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Phone, MapPin, Heart, Eye, Star, X, Send, Bot, Plus, Minus, Trash2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge: string;
  rating: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

const products: Product[] = [
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

const sliderVideos = [
  '/promo1.mp4',
  '/promo2.mp4',
  '/promo3.mp4'
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside');

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Shagotom Amorea-te! 🌸 Ami apnar AI style assistant. Aj apnake kon dhoroner pakistani dress ba skincare product khuje pete sahajjo korte pari?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderVideos.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderVideos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderVideos.length) % sliderVideos.length);
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = deliveryZone === 'inside' ? 80 : 150;
  const grandTotal = subtotal > 0 ? subtotal + deliveryCharge : 0;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    setOrderSuccess(true);
    setTimeout(() => {
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setOrderSuccess(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    }, 3000);
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter((p) => p.category === activeCategory);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      let aiReply = "Dhonnobad apnar bartar jonno! Amader kache chomtokar sob original pakistani lawn o chiffon collection royeche.";
      const lower = userText.toLowerCase();

      if (lower.includes('pakistani') || lower.includes('dress') || lower.includes('ড্রেস')) {
        aiReply = "Amader kache exclusive pakistani lawn, suti ebong velvet three-piece royeche (dam 8,500 theke 12,200 takar modhye).";
      } else if (lower.includes('skin') || lower.includes('serum') || lower.includes('cream')) {
        aiReply = "Amader skincare category-te premium brightening serum o night repair cream royeche.";
      } else if (lower.includes('price') || lower.includes('dam')) {
        aiReply = "Amader product-gular dam khubi sashroyi ebong premium quality-r. Bag 3,950 taka theke shuru.";
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' }}>
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: 'rgba(0, 0, 0, 0.85)', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img 
            src="/logo.JPG" 
            alt="Amorea Main Logo" 
            style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '50%', border: '1px solid rgba(245, 158, 11, 0.4)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontFamily: 'serif', fontWeight: 'bold', letterSpacing: '0.25em', background: 'linear-gradient(to right, #fde68a, #f59e0b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AMOREA
            </span>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(253, 230, 138, 0.6)', textTransform: 'uppercase', marginTop: '-2px' }}>
              Luxury Lifestyle
            </span>
          </div>
        </a>

        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: 500, color: '#d4d4d4' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
          <a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>Collections</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', fontWeight: 'bold', padding: '10px 20px', borderRadius: '9999px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}
        >
          <ShoppingBag size={18} />
          <span>Cart ({totalItems})</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', backgroundColor: '#000000' }}>
          {sliderVideos.map((videoSrc, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                opacity: index === currentSlide ? 0.7 : 0,
                scale: index === currentSlide ? 1 : 1.08,
                filter: index === currentSlide ? "blur(0px) brightness(0.85)" : "blur(14px) brightness(0.4)"
              }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,1), rgba(10,10,10,0.5), rgba(0,0,0,0.4))', zIndex: 10 }}></div>
        </div>

        <button 
          onClick={prevSlide}
          style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 30, backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', padding: '12px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 30, backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', padding: '12px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronRight size={24} />
        </button>

        <div style={{ maxWidth: '900px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '32px' }}>
          <a href="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px', textDecoration: 'none' }}>
            <motion.div
              key={currentSlide}
              initial={{ rotateY: 720, rotateZ: 360, scale: 0.2, opacity: 0 }}
              animate={{ rotateY: 0, rotateZ: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img 
                animate={{ 
                  filter: [
                    "drop-shadow(0 0 25px rgba(212,175,55,0.5))",
                    "drop-shadow(0 0 50px rgba(255,215,0,0.95))",
                    "drop-shadow(0 0 25px rgba(212,175,55,0.5))"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="/logotransparent.png" 
                alt="Amorea Transparent Logo" 
                style={{ width: '180px', height: '180px', objectFit: 'contain', cursor: 'pointer' }}
              />
            </motion.div>
          </a>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ color: 'rgba(253, 230, 138, 0.9)', fontWeight: 500, letterSpacing: '0.25em', fontSize: '13px', textTransform: 'uppercase', marginBottom: '12px' }}
          >
            ✦ Premium Pakistani Wear & Luxury Lifestyle in Bangladesh ✦
          </motion.h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'normal', fontFamily: 'serif', color: '#e5e5e5' }}>
              Elegance Defined by
            </span>

            <motion.div
              key={currentSlide}
              style={{ display: 'inline-flex', alignItems: 'center', fontSize: '24px', fontFamily: 'serif', fontWeight: 'bold', letterSpacing: '0.15em', overflow: 'hidden', padding: '4px 8px' }}
            >
              <motion.span
                initial={{ x: '-60vw', opacity: 0, scale: 0.5 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-block' }}
              >
                <motion.span
                  initial={{ color: '#E0F7FA' }}
                  animate={{ color: '#F59E0B' }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  A
                </motion.span>
              </motion.span>

              <motion.span
                initial={{ color: '#B2EBF2', textShadow: '0 0 15px #00E5FF, 0 0 25px #E0F7FA' }}
                animate={{ 
                  color: ['#B2EBF2', '#B2EBF2', '#F59E0B'],
                  textShadow: [
                    '0 0 15px #00E5FF, 0 0 25px #E0F7FA',
                    '0 0 15px #00E5FF, 0 0 25px #E0F7FA',
                    '0 0 20px rgba(245,158,11,0.9), 0 0 35px rgba(212,175,55,0.7)'
                  ]
                }}
                transition={{ duration: 1.4, times: [0, 0.75, 1], ease: "easeInOut" }}
                style={{ display: 'inline-block', padding: '0 4px' }}
              >
                MORE
              </motion.span>

              <motion.span
                initial={{ x: '60vw', opacity: 0, scale: 0.5 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-block' }}
              >
                <motion.span
                  initial={{ color: '#E0F7FA' }}
                  animate={{ color: '#F59E0B' }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  A
                </motion.span>
              </motion.span>
            </motion.div>
          </div>

          <p style={{ maxWidth: '600px', margin: '0 auto 28px auto', color: '#d4d4d4', fontSize: '15px', lineHeight: '1.6', fontWeight: 300 }}>
            Discover authentic Pakistani dresses, premium skincare, stylish bags, and footwear curated exclusively for fashion lovers in Bangladesh.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
            <a 
              href="#shop"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', fontWeight: 'bold', padding: '14px 32px', borderRadius: '9999px', textDecoration: 'none', boxShadow: '0 0 25px rgba(245,158,11,0.4)', fontSize: '14px' }}
            >
              <ShoppingBag size={18} />
              <span>Explore Collections</span>
            </a>
            <button 
              onClick={() => setIsChatOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.5)', backgroundColor: 'transparent', color: '#fde68a', padding: '14px 28px', borderRadius: '9999px', cursor: 'pointer', backdropFilter: 'blur(10px)', fontSize: '14px' }}
            >
              <Sparkles size={18} />
              <span>Chat with AI Stylist</span>
            </button>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="shop" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#f59e0b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600, display: 'block', marginBottom: '12px' }}>Curated Perfection</span>
          <h3 style={{ fontSize: '36px', fontFamily: 'serif', fontWeight: 'bold', color: '#fef3c7', marginBottom: '16px' }}>
            Featured Collections
          </h3>
          <p style={{ color: '#a3a3a3', maxWidth: '500px', margin: '0 auto', fontSize: '14px' }}>
            Explore our handpicked range of high-end fashion, skincare essentials, and luxury accessories.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            {[
              { label: 'All Items', value: 'all' },
              { label: 'Pakistani Wear', value: 'pakistani-wear' },
              { label: 'Skincare & Beauty', value: 'skincare' },
              { label: 'Bags', value: 'bags' },
              { label: 'Footwear', value: 'footwear' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: activeCategory === tab.value ? 'bold' : 500,
                  cursor: 'pointer',
                  border: activeCategory === tab.value ? 'none' : '1px solid #262626',
                  background: activeCategory === tab.value ? 'linear-gradient(to right, #f59e0b, #d97706)' : '#171717',
                  color: activeCategory === tab.value ? '#000000' : '#d4d4d4',
                  boxShadow: activeCategory === tab.value ? '0 0 15px rgba(245,158,11,0.4)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: '0.4' }}
              style={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', border: '1px solid rgba(38, 38, 38, 0.8)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            >
              <div style={{ position: 'relative', height: '320px', overflow: 'hidden', backgroundColor: '#000000' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#f59e0b', color: '#000000', fontSize: '11px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.badge}
                </span>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px' }}>
                    <Star size={14} fill="#f59e0b" />
                    <span>{product.rating}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#737373', letterSpacing: '0.2em', fontFamily: 'serif' }}>AMOREA</span>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>
                  {product.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #262626', paddingTop: '16px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>৳ {product.price.toLocaleString('bn-BD')}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#262626', color: '#f59e0b', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'relative', width: '100%', maxWidth: '400px', backgroundColor: '#171717', height: '100%', boxShadow: '-10px 0 30px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', zIndex: 10, borderLeft: '1px solid rgba(245,158,11,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'serif' }}>
                  <ShoppingBag size={20} /> Shopping Cart ({totalItems})
                </h3>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: '#737373' }}>
                    <ShoppingBag size={48} style={{ margin: '0 auto 16px auto', opacity: 0.4 }} />
                    <p>Apnar cart-ti bortomane khali.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '16px', backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '12px', border: '1px solid #262626', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>{item.name}</h4>
                        <p style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold' }}>৳ {item.price.toLocaleString('bn-BD')}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '4px 8px', backgroundColor: '#262626', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '4px 8px', backgroundColor: '#262626', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#737373', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ padding: '24px', borderTop: '1px solid #262626', backgroundColor: 'rgba(0,0,0,0.9)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a3', marginBottom: '16px' }}>
                    <span>Subtotal:</span>
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>৳ {subtotal.toLocaleString('bn-BD')}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    style={{ width: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', fontWeight: 'bold', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                  >
                    Proceed to Cash on Delivery
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: '#171717', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', zIndex: 10, maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #262626', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', fontFamily: 'serif' }}>Cash on Delivery Order</h3>
                <button onClick={() => setIsCheckoutOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {orderSuccess ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <CheckCircle size={64} style={{ color: '#34d399', margin: '0 auto 16px auto' }} />
                  <h4 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>Order shofolvabe shomponno hoyeche!</h4>
                  <p style={{ color: '#a3a3a3', fontSize: '14px' }}>Amader team khub shighroi apnar sathe call kore order-ti confirm korbe.</p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#d4d4d4', fontWeight: 500, marginBottom: '6px' }}>Apnar Purno Nam *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Jemon: Afra Afrin"
                      style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#d4d4d4', fontWeight: 500, marginBottom: '6px' }}>Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Jemon: 01700000000"
                      style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#d4d4d4', fontWeight: 500, marginBottom: '6px' }}>Delivery Address *</label>
                    <textarea
                      required
                      rows={3}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="District, Thana, Road/House number..."
                      style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#d4d4d4', fontWeight: 500, marginBottom: '8px' }}>Delivery Area *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('inside')}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: deliveryZone === 'inside' ? '1px solid #f59e0b' : '1px solid #262626',
                          backgroundColor: deliveryZone === 'inside' ? 'rgba(245,158,11,0.1)' : '#0a0a0a',
                          color: deliveryZone === 'inside' ? '#f59e0b' : '#a3a3a3',
                          fontWeight: deliveryZone === 'inside' ? 'bold' : 'normal',
                          cursor: 'pointer'
                        }}
                      >
                        Dhakar Bhitore (৳80)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('outside')}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: deliveryZone === 'outside' ? '1px solid #f59e0b' : '1px solid #262626',
                          backgroundColor: deliveryZone === 'outside' ? 'rgba(245,158,11,0.1)' : '#0a0a0a',
                          color: deliveryZone === 'outside' ? '#f59e0b' : '#a3a3a3',
                          fontWeight: deliveryZone === 'outside' ? 'bold' : 'normal',
                          cursor: 'pointer'
                        }}
                      >
                        Dhakar Baire (৳150)
                      </button>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '12px', border: '1px solid #262626', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a3a3a3' }}>
                      <span>Subtotal:</span>
                      <span>৳ {subtotal.toLocaleString('bn-BD')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a3a3a3' }}>
                      <span>Delivery Charge:</span>
                      <span>৳ {deliveryCharge.toLocaleString('bn-BD')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', fontWeight: 'bold', fontSize: '16px', borderTop: '1px solid #262626', paddingTop: '8px' }}>
                      <span>Grand Total:</span>
                      <span>৳ {grandTotal.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ width: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', fontWeight: 'bold', padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '8px', fontSize: '15px' }}
                  >
                    Confirm Order (Cash on Delivery)
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Chatbot Widget */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 40 }}>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsChatOpen(true)}
            style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', padding: '16px', borderRadius: '50%', border: 'none', cursor: 'pointer', boxShadow: '0 0 25px rgba(245,158,11,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Sparkles size={24} />
          </motion.button>
        )}

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{ backgroundColor: '#171717', border: '1px solid rgba(245,158,11,0.3)', width: '360px', height: '500px', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ backgroundColor: 'rgba(0,0,0,0.9)', padding: '16px 20px', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', padding: '8px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', display: 'flex' }}>
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '14px', margin: 0 }}>Amorea AI Stylist</h4>
                    <p style={{ fontSize: '11px', color: '#34d399', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }}></span> Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', backgroundColor: 'rgba(10,10,10,0.5)' }}>
                {messages.map((msg, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: '16px', lineHeight: '1.5', backgroundColor: msg.sender === 'user' ? '#f59e0b' : '#171717', color: msg.sender === 'user' ? '#000000' : '#e5e5e5', border: msg.sender === 'user' ? 'none' : '1px solid #262626', fontWeight: msg.sender === 'user' ? 500 : 'normal' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: '12px', backgroundColor: 'rgba(0,0,0,0.9)', borderTop: '1px solid #262626', display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Apnar pochondo ba proshno likhun..."
                  style={{ flex: 1, backgroundColor: '#171717', border: '1px solid #262626', color: '#ffffff', padding: '10px 16px', borderRadius: '9999px', fontSize: '14px', outline: 'none' }}
                />
                <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer id="contact" style={{ backgroundColor: '#000000', borderTop: '1px solid #171717', color: '#a3a3a3', padding: '48px 32px', fontSize: '14px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', mdDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
            <img 
              src="/logo.JPG" 
              alt="Amorea Footer Logo" 
              style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)' }}
            />
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '18px', margin: '0 0 4px 0', letterSpacing: '0.15em', fontFamily: 'serif' }}>AMOREA</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4d4d4', margin: '0 0 4px 0', fontSize: '13px' }}>
                <MapPin size={14} style={{ color: '#f59e0b', flexShrink: 0 }} /> Valencia Building, SA Khalek City, Gabtoli, Dhaka
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4d4d4', margin: 0, fontSize: '13px' }}>
                <Phone size={14} style={{ color: '#f59e0b', flexShrink: 0 }} /> +880 1779-747967
              </p>
            </div>
          </a>
          <p style={{ color: '#737373', fontSize: '13px', margin: 0 }}>© 2026 amorea.com.bd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}