'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Star, X, Send, Bot, Plus, Minus, Trash2, CheckCircle, UserRound, ChevronDown, Phone, ArrowUpRight } from 'lucide-react';
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
  translationKey?: TranslationKey;
}

type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    languageLabel: 'Language',
    close: 'Close',
    removeItem: 'Remove item',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
    sendMessage: 'Send message',
    skipToContent: 'Skip to content',
    mainNavigation: 'Main navigation',
    switchLanguage: 'Switch language to Bengali',
    home: 'Home',
    collections: 'Collections',
    contact: 'Contact',
    contactEyebrow: 'GET IN TOUCH',
    contactHeading: 'We’re here to help',
    contactDescription: 'Choose the easiest way to reach Amorea.',
    contactPhone: 'Call us',
    contactMessenger: 'Message us on Facebook',
    contactInstagram: 'Follow us on Instagram',
    contactWhatsApp: 'Chat with us on WhatsApp',
    cart: 'Cart',
    account: 'Account',
    signUp: 'Sign-Up',
    login: 'Login',
    signUpTitle: 'Create your account',
    signUpDescription: 'Choose a sign-up method. These options will be configured later.',
    loginTitle: 'Welcome back',
    loginDescription: 'Choose a login method. These options will be configured later.',
    setupLater: 'Coming soon',
    securityCheckTitle: 'DATA security check',
    securityCheckRunning: 'Running a brief security check...',
    securityCheckComplete: 'Security Checking Completed...',
    securityCheckNotice: 'This demo does not verify overall website security. It cannot access or save your media.',
    allItems: 'All Items',
    pakistaniWear: 'Pakistani Wear',
    skincareBeauty: 'Skincare & Beauty',
    bags: 'Bags',
    footwear: 'Footwear',
    luxuryLifestyle: 'Luxury Lifestyle',
    comingSoon: 'Coming Soon...',
    heroKicker: '✦ Premium Pakistani Wear & Luxury Lifestyle in Bangladesh ✦',
    eleganceDefined: 'Elegance Defined by',
    heroDescription: 'Discover authentic Pakistani dresses, premium skincare, stylish bags, and footwear curated exclusively for fashion lovers in Bangladesh.',
    exploreCollections: 'Explore Collections',
    chatWithStylist: 'Chat with AI Stylist',
    curatedPerfection: 'Curated Perfection',
    featuredCollections: 'Featured Collections',
    collectionsDescription: 'Explore our handpicked range of high-end fashion, skincare essentials, and luxury accessories.',
    authenticPakistani: 'Authentic Pakistani',
    bestSeller: 'Best Seller',
    imported: 'Imported',
    organic: 'Organic',
    exclusive: 'Exclusive',
    newArrival: 'New Arrival',
    product1: 'Authentic Lawn Embroidered 3-Piece',
    product2: 'Luxury Chiffon Collection Velvet Suit',
    product3: 'Glow Essence Brightening Serum',
    product4: 'Hydrating Night Repair Cream',
    product5: 'Luxury Golden Chain Shoulder Bag',
    product6: 'Embroidered Premium Velvet Heels',
    addToCart: 'Add to Cart',
    shoppingCart: 'Shopping Cart',
    emptyCart: 'Your cart is currently empty.',
    subtotal: 'Subtotal:',
    proceedCheckout: 'Proceed to Cash on Delivery',
    checkoutTitle: 'Cash on Delivery Order',
    orderSuccess: 'Your order has been placed successfully!',
    orderSuccessDescription: 'Our team will call you shortly to confirm your order.',
    fullName: 'Full Name *',
    namePlaceholder: 'e.g. Afra Afrin',
    mobileNumber: 'Mobile Number *',
    phonePlaceholder: 'e.g. 01700000000',
    deliveryAddress: 'Delivery Address *',
    addressPlaceholder: 'District, Thana, Road/House number...',
    deliveryArea: 'Delivery Area *',
    dhakaCity: 'Dhaka City',
    outsideDhaka: 'Outside Dhaka',
    deliveryCharge: 'Delivery Charge:',
    totalPayable: 'Total Payable:',
    confirmOrder: 'Confirm Order (Cash on Delivery)',
    chatTitle: 'Amorea AI Stylist',
    online: '● Online',
    chatPlaceholder: 'Ask us anything...',
    chatWelcome: 'Welcome to Amorea! 🌸 I am your AI style assistant. What kind of Pakistani clothing or skincare products can I help you find today?',
    chatDefaultReply: 'Thank you for your message! We have a wonderful collection of original Pakistani lawn and chiffon.',
    chatClothingReply: 'We have exclusive Pakistani lawn, cotton, and velvet three-piece suits (priced from ৳8,500 to ৳12,200).',
    chatSkincareReply: 'Our skincare category features a premium brightening serum and night repair cream.',
    chatPriceReply: 'Our products offer great value and premium quality. Bags start at ৳3,950.',
  },
  bn: {
    languageLabel: 'ভাষা',
    close: 'বন্ধ করুন',
    removeItem: 'পণ্য সরান',
    decreaseQuantity: 'পরিমাণ কমান',
    increaseQuantity: 'পরিমাণ বাড়ান',
    sendMessage: 'বার্তা পাঠান',
    skipToContent: 'মূল কনটেন্টে যান',
    mainNavigation: 'প্রধান নেভিগেশন',
    switchLanguage: 'ইংরেজিতে পরিবর্তন করুন',
    home: 'হোম',
    collections: 'কালেকশন',
    contact: 'যোগাযোগ',
    contactEyebrow: 'যোগাযোগ করুন',
    contactHeading: 'আমরা সাহায্য করতে প্রস্তুত',
    contactDescription: 'আমোরিয়ার সঙ্গে যোগাযোগের জন্য আপনার পছন্দের মাধ্যমটি বেছে নিন।',
    contactPhone: 'ফোন করুন',
    contactMessenger: 'ফেসবুক মেসেঞ্জারে মেসেজ করুন',
    contactInstagram: 'ইনস্টাগ্রামে আমাদের অনুসরণ করুন',
    contactWhatsApp: 'হোয়াটসঅ্যাপে চ্যাট করুন',
    cart: 'কার্ট',
    account: 'অ্যাকাউন্ট',
    signUp: 'নিবন্ধন',
    login: 'লগ ইন',
    signUpTitle: 'আপনার অ্যাকাউন্ট তৈরি করুন',
    signUpDescription: 'নিবন্ধনের মাধ্যম বেছে নিন। অপশনগুলো পরে কনফিগার করা হবে।',
    loginTitle: 'আবারও স্বাগতম',
    loginDescription: 'লগ ইন করার মাধ্যম বেছে নিন। অপশনগুলো পরে কনফিগার করা হবে।',
    setupLater: 'শীঘ্রই আসছে',
    securityCheckTitle: 'DATA নিরাপত্তা যাচাই',
    securityCheckRunning: 'একটি সংক্ষিপ্ত নিরাপত্তা যাচাই চলছে...',
    securityCheckComplete: 'নিরাপত্তা যাচাই সম্পন্ন হয়েছে...',
    securityCheckNotice: 'এই ডেমো পুরো ওয়েবসাইটের নিরাপত্তা যাচাই করে না। এটি আপনার মিডিয়া দেখতে বা সংরক্ষণ করতে পারে না।',
    allItems: 'সব পণ্য',
    pakistaniWear: 'পাকিস্তানি পোশাক',
    skincareBeauty: 'ত্বক ও সৌন্দর্যচর্চা',
    bags: 'ব্যাগ',
    footwear: 'জুতা',
    luxuryLifestyle: 'বিলাসবহুল জীবনধারা',
    comingSoon: 'Coming Soon...',
    heroKicker: '✦ Premium Pakistani Wear & Luxury Lifestyle in Bangladesh ✦',
    eleganceDefined: 'আভিজাত্যের নতুন সংজ্ঞা',
    heroDescription: 'ফ্যাশনপ্রেমীদের জন্য বাছাই করা আসল পাকিস্তানি পোশাক, প্রিমিয়াম স্কিনকেয়ার, স্টাইলিশ ব্যাগ ও জুতা দেখুন।',
    exploreCollections: 'কালেকশন দেখুন',
    chatWithStylist: 'এআই স্টাইলিস্টের সাথে কথা বলুন',
    curatedPerfection: 'যত্নে বাছাই করা',
    featuredCollections: 'বিশেষ কালেকশন',
    collectionsDescription: 'উচ্চমানের ফ্যাশন, স্কিনকেয়ার ও বিলাসবহুল অনুষঙ্গের বাছাই করা কালেকশন দেখুন।',
    authenticPakistani: 'আসল পাকিস্তানি',
    bestSeller: 'সেরা বিক্রিত',
    imported: 'আমদানিকৃত',
    organic: 'অর্গানিক',
    exclusive: 'এক্সক্লুসিভ',
    newArrival: 'নতুন',
    product1: 'এমব্রয়ডারি করা আসল লন ৩-পিস',
    product2: 'লাক্সারি শিফন ভেলভেট স্যুট',
    product3: 'গ্লো এসেন্স ব্রাইটেনিং সিরাম',
    product4: 'হাইড্রেটিং নাইট রিপেয়ার ক্রিম',
    product5: 'সোনালি চেইন শোল্ডার ব্যাগ',
    product6: 'এমব্রয়ডারি করা প্রিমিয়াম ভেলভেট হিল',
    addToCart: 'কার্টে যোগ করুন',
    shoppingCart: 'শপিং কার্ট',
    emptyCart: 'আপনার কার্ট এখন খালি।',
    subtotal: 'পণ্যের মোট:',
    proceedCheckout: 'ক্যাশ অন ডেলিভারিতে এগিয়ে যান',
    checkoutTitle: 'ক্যাশ অন ডেলিভারি অর্ডার',
    orderSuccess: 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!',
    orderSuccessDescription: 'অর্ডার নিশ্চিত করতে আমাদের টিম শিগগিরই আপনাকে ফোন করবে।',
    fullName: 'আপনার পূর্ণ নাম *',
    namePlaceholder: 'যেমন: আফরা আফরিন',
    mobileNumber: 'মোবাইল নম্বর *',
    phonePlaceholder: 'যেমন: ০১৭০০০০০০০০',
    deliveryAddress: 'ডেলিভারির ঠিকানা *',
    addressPlaceholder: 'জেলা, থানা, রোড/বাড়ি নম্বর...',
    deliveryArea: 'ডেলিভারি এলাকা *',
    dhakaCity: 'ঢাকা শহর',
    outsideDhaka: 'ঢাকার বাইরে',
    deliveryCharge: 'ডেলিভারি চার্জ:',
    totalPayable: 'সর্বমোট:',
    confirmOrder: 'অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)',
    chatTitle: 'আমোরিয়া এআই স্টাইলিস্ট',
    online: '● অনলাইন',
    chatPlaceholder: 'আপনার প্রশ্ন লিখুন...',
    chatWelcome: 'আমোরিয়ায় স্বাগতম! 🌸 আমি আপনার এআই স্টাইল সহকারী। আজ কী ধরনের পাকিস্তানি পোশাক বা স্কিনকেয়ার পণ্য খুঁজছেন?',
    chatDefaultReply: 'আপনার বার্তার জন্য ধন্যবাদ! আমাদের কাছে আসল পাকিস্তানি লন ও শিফনের চমৎকার কালেকশন রয়েছে।',
    chatClothingReply: 'আমাদের কাছে এক্সক্লুসিভ পাকিস্তানি লন, সুতি ও ভেলভেট থ্রি-পিস রয়েছে (দাম ৳৮,৫০০ থেকে ৳১২,২০০)।',
    chatSkincareReply: 'আমাদের স্কিনকেয়ার কালেকশনে রয়েছে প্রিমিয়াম ব্রাইটেনিং সিরাম ও নাইট রিপেয়ার ক্রিম।',
    chatPriceReply: 'আমাদের পণ্যগুলো সাশ্রয়ী দামে প্রিমিয়াম মানের। ব্যাগের দাম শুরু ৳৩,৯৫০ থেকে।',
  },
} as const;

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
  '/promo4.MP4',
  '/promo1.mp4',
  '/promo2.mp4',
  '/promo3.mp4',
];
const videoTransitionDurationMs = 2600;
const videoTransitionDurationSeconds = videoTransitionDurationMs / 1000;

const categories: { translationKey: TranslationKey; value: string }[] = [
  { translationKey: 'allItems', value: 'all' },
  { translationKey: 'pakistaniWear', value: 'pakistani-wear' },
  { translationKey: 'skincareBeauty', value: 'skincare' },
  { translationKey: 'bags', value: 'bags' },
  { translationKey: 'footwear', value: 'footwear' },
];

const productTranslationKeys: Record<number, { name: TranslationKey; badge: TranslationKey }> = {
  1: { name: 'product1', badge: 'authenticPakistani' },
  2: { name: 'product2', badge: 'bestSeller' },
  3: { name: 'product3', badge: 'imported' },
  4: { name: 'product4', badge: 'organic' },
  5: { name: 'product5', badge: 'exclusive' },
  6: { name: 'product6', badge: 'newArrival' },
};

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<'signUp' | 'login' | null>(null);
  const [authFlowStage, setAuthFlowStage] = useState<'checking' | 'complete' | 'form'>('checking');
  const collectionsMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const backgroundVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isVideoTransitioning = useRef(false);
  const videoTransitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showVideoPoster, setShowVideoPoster] = useState(true);
  
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
    { sender: 'ai', text: '', translationKey: 'chatWelcome' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const [currentSlide, setCurrentSlide] = useState(0);
  const t = (key: TranslationKey) => translations[language][key];
  const formatPrice = (price: number) => price.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-BD');
  const translatedProduct = (product: Product, field: 'name' | 'badge') =>
    t(productTranslationKeys[product.id][field]);

  useEffect(() => {
    document.documentElement.lang = language === 'bn' ? 'bn-BD' : 'en-BD';
  }, [language]);

  useEffect(() => {
    if (!isAccountOpen && !isCollectionsOpen && !authDialogMode) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node) {
        if (!accountMenuRef.current?.contains(event.target)) setIsAccountOpen(false);
        if (!collectionsMenuRef.current?.contains(event.target)) setIsCollectionsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountOpen(false);
        setIsCollectionsOpen(false);
        setAuthDialogMode(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountOpen, isCollectionsOpen, authDialogMode]);

  useEffect(() => {
    if (!authDialogMode) return;

    const completeTimer = setTimeout(() => setAuthFlowStage('complete'), 2500);
    const formTimer = setTimeout(() => setAuthFlowStage('form'), 4500);
    return () => {
      clearTimeout(completeTimer);
      clearTimeout(formTimer);
    };
  }, [authDialogMode]);

  useEffect(() => {
    const activeVideo = backgroundVideoRefs.current[currentSlide];
    if (!activeVideo) return;

    activeVideo.currentTime = 0;
    void activeVideo.play().catch((error: unknown) => {
      setShowVideoPoster(true);
      console.error(`Unable to play background video ${sliderVideos[currentSlide]}`, error);
    });
  }, [currentSlide]);

  useEffect(() => () => {
    if (videoTransitionTimer.current) clearTimeout(videoTransitionTimer.current);
    backgroundVideoRefs.current.forEach((video) => video?.pause());
  }, []);

  const advanceBackgroundVideo = () => {
    if (isVideoTransitioning.current) return;

    isVideoTransitioning.current = true;
    const outgoingSlide = currentSlide;
    setCurrentSlide((slide) => (slide + 1) % sliderVideos.length);
    videoTransitionTimer.current = setTimeout(() => {
      backgroundVideoRefs.current[outgoingSlide]?.pause();
      isVideoTransitioning.current = false;
      videoTransitionTimer.current = null;
    }, videoTransitionDurationMs);
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
      let aiReply: TranslationKey = 'chatDefaultReply';
      const lower = userText.toLowerCase();

      if (lower.includes('pakistani') || lower.includes('dress') || lower.includes('ড্রেস') || lower.includes('পোশাক')) {
        aiReply = 'chatClothingReply';
      } else if (lower.includes('skin') || lower.includes('serum') || lower.includes('cream') || lower.includes('ত্বক')) {
        aiReply = 'chatSkincareReply';
      } else if (lower.includes('price') || lower.includes('dam') || lower.includes('দাম')) {
        aiReply = 'chatPriceReply';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: '', translationKey: aiReply }]);
    }, 1000);
  };

  return (
    <div className="site-shell" style={{ minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' }}>
      <div className="site-video-background" aria-hidden="true">
        {sliderVideos.map((videoSrc, index) => (
          <motion.div
            key={videoSrc}
            className="site-video-slide"
            initial={false}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1.04 : 1.08,
              filter: index === currentSlide ? 'blur(0px)' : 'blur(8px)',
            }}
            transition={{ duration: videoTransitionDurationMs / 1000, ease: [0.45, 0, 0.55, 1] }}
          >
            <video
              ref={(video) => { backgroundVideoRefs.current[index] = video; }}
              autoPlay={index === currentSlide}
              muted
              playsInline
              poster="/video-poster.jpg"
              preload={index === currentSlide ? 'auto' : 'none'}
              onPlaying={() => {
                if (index === currentSlide) setShowVideoPoster(false);
              }}
              onError={() => {
                if (index !== currentSlide) return;
                setShowVideoPoster(true);
                console.error(`Unable to load background video ${videoSrc}`);
              }}
              onTimeUpdate={(event) => {
                if (index !== currentSlide) return;
                const { currentTime, duration } = event.currentTarget;
                if (
                  Number.isFinite(duration) &&
                  duration > 0 &&
                  duration - currentTime <= videoTransitionDurationSeconds + 0.25
                ) {
                  advanceBackgroundVideo();
                }
              }}
              onEnded={() => {
                if (index === currentSlide) advanceBackgroundVideo();
              }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </motion.div>
        ))}
        <div
          className="site-video-poster"
          style={{ opacity: showVideoPoster ? 1 : 0 }}
        />
        <div className="site-video-overlay" />
      </div>

      <a className="skip-link" href="#main-content">
        {t('skipToContent')}
      </a>

      {/* Navigation Bar */}
      <nav aria-label={t('mainNavigation')} className="site-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: 'rgba(0, 0, 0, 0.62)', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <a href="#" className="site-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <Image src="/logo.JPG" alt="Amorea Main Logo" width={48} height={48} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="site-nav-brand-copy" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontFamily: 'serif', fontWeight: 'bold', letterSpacing: '0.25em', background: 'linear-gradient(to right, #fde68a, #f59e0b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AMOREA
            </span>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(253, 230, 138, 0.6)', textTransform: 'uppercase', marginTop: '-2px' }}>
              {t('luxuryLifestyle')}
            </span>
          </div>
        </a>

        <div className="site-nav-links" style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: 500, color: '#d4d4d4' }}>
          <button
            type="button"
            className="language-toggle"
            onClick={() => setLanguage((currentLanguage) => currentLanguage === 'en' ? 'bn' : 'en')}
            aria-label={t('switchLanguage')}
            title={t('switchLanguage')}
          >
            <span className="language-flag" aria-hidden="true">{language === 'en' ? '🇧🇩' : '🇬🇧'}</span>
            <span className="language-name">{language === 'en' ? 'বাংলা' : 'English'}</span>
          </button>
          <a href="#main-content" style={{ color: 'inherit', textDecoration: 'none' }}>{t('home')}</a>
          <div ref={collectionsMenuRef} className="collections-menu-anchor" style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsCollectionsOpen((isOpen) => !isOpen)}
              aria-expanded={isCollectionsOpen}
              aria-haspopup="menu"
              aria-controls="collections-menu"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: 0, border: 0, background: 'transparent', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
            >
              {t('collections')}
              <ChevronDown size={14} style={{ transform: isCollectionsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }} />
            </button>
            <AnimatePresence>
              {isCollectionsOpen && (
                <motion.div
                  id="collections-menu"
                  className="collections-menu"
                  role="menu"
                  aria-label={t('collections')}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  style={{ position: 'absolute', top: 'calc(100% + 14px)', left: 0, width: '210px', padding: '8px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)', backgroundColor: '#171717', boxShadow: '0 12px 35px rgba(0,0,0,0.55)', zIndex: 60 }}
                >
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setActiveCategory(category.value);
                        setIsCollectionsOpen(false);
                        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{ width: '100%', padding: '11px 12px', border: 0, borderRadius: '9px', background: activeCategory === category.value ? 'rgba(245, 158, 11, 0.14)' : 'transparent', color: activeCategory === category.value ? '#fbbf24' : '#f5f5f5', textAlign: 'left', fontSize: '14px', cursor: 'pointer' }}
                    >
                      {t(category.translationKey)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>{t('contact')}</a>
        </div>

        <div className="site-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="nav-cart-button"
            aria-label={`${t('cart')} (${formatPrice(totalItems)})`}
            onClick={() => setIsCartOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', fontWeight: 'bold', padding: '10px 20px', borderRadius: '9999px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}
          >
            <ShoppingBag size={18} />
            <span className="nav-cart-label">{t('cart')}</span>
            <span className="nav-cart-count">({formatPrice(totalItems)})</span>
          </button>
          <div ref={accountMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="nav-account-button"
              aria-label={t('account')}
              onClick={() => setIsAccountOpen((isOpen) => !isOpen)}
              aria-expanded={isAccountOpen}
              aria-haspopup="menu"
              aria-controls="account-menu"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#171717', color: '#fde68a', fontWeight: 600, padding: '10px 16px', borderRadius: '9999px', border: '1px solid rgba(245, 158, 11, 0.4)', cursor: 'pointer' }}
            >
              <UserRound size={17} />
              <span className="nav-account-label">{t('account')}</span>
              <ChevronDown size={15} style={{ transform: isAccountOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }} />
            </button>
            <AnimatePresence>
              {isAccountOpen && (
                <motion.div
                  id="account-menu"
                  role="menu"
                  aria-label={t('account')}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="account-menu"
                  style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '180px', padding: '8px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)', backgroundColor: '#171717', boxShadow: '0 12px 35px rgba(0,0,0,0.55)', zIndex: 60 }}
                >
                  <button type="button" role="menuitem" onClick={() => { setIsAccountOpen(false); setAuthFlowStage('checking'); setAuthDialogMode('signUp'); }} style={{ width: '100%', padding: '11px 12px', border: 0, borderRadius: '9px', background: 'transparent', color: '#f5f5f5', textAlign: 'left', fontSize: '14px', cursor: 'pointer' }}>
                    {t('signUp')}
                  </button>
                  <button type="button" role="menuitem" onClick={() => { setIsAccountOpen(false); setAuthFlowStage('checking'); setAuthDialogMode('login'); }} style={{ width: '100%', padding: '11px 12px', border: 0, borderRadius: '9px', background: 'transparent', color: '#f5f5f5', textAlign: 'left', fontSize: '14px', cursor: 'pointer' }}>
                    {t('login')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {authDialogMode && (
          <motion.div
            className="signup-overlay"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setAuthDialogMode(null);
            }}
          >
            <motion.section
              className="signup-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={authFlowStage === 'form' ? 'auth-dialog-title' : 'auth-check-title'}
              aria-describedby={authFlowStage === 'form' ? 'auth-dialog-description' : 'auth-check-description'}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <button
                type="button"
                className="signup-close"
                aria-label={t('close')}
                onClick={() => setAuthDialogMode(null)}
              >
                <X size={19} />
              </button>
              <AnimatePresence mode="wait" initial={false}>
                {authFlowStage !== 'form' ? (
                  <motion.div
                    key="security-check"
                    className="auth-check-screen"
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span className="signup-eyebrow">AMOREA</span>
                    <h2 id="auth-check-title">{t('securityCheckTitle')}</h2>
                    {authFlowStage === 'checking' ? (
                      <>
                        <span className="auth-check-spinner" aria-hidden="true" />
                        <p id="auth-check-description">{t('securityCheckRunning')}</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="auth-check-success" size={42} aria-hidden="true" />
                        <p className="auth-check-complete">{t('securityCheckComplete')}</p>
                        <p id="auth-check-description" className="auth-check-notice">{t('securityCheckNotice')}</p>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={authDialogMode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Image
                      className="signup-logo"
                      src="/logo.JPG"
                      alt="Amorea"
                      width={64}
                      height={64}
                    />
                    <span className="signup-eyebrow">AMOREA</span>
                    <h2 id="auth-dialog-title">{t(authDialogMode === 'signUp' ? 'signUpTitle' : 'loginTitle')}</h2>
                    <p id="auth-dialog-description">{t(authDialogMode === 'signUp' ? 'signUpDescription' : 'loginDescription')}</p>
                    <div className="signup-providers">
                <button type="button" className="signup-provider signup-provider-google" disabled>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.95 2.94v2.4h3.16c1.85-1.7 2.9-4.2 2.9-7.18Z" />
                    <path fill="#34A853" d="M12 21.75c2.64 0 4.86-.88 6.48-2.38l-3.16-2.4c-.88.59-2 .94-3.32.94-2.55 0-4.72-1.72-5.5-4.04H3.23v2.47A9.78 9.78 0 0 0 12 21.75Z" />
                    <path fill="#FBBC05" d="M6.5 13.87a5.88 5.88 0 0 1 0-3.74V7.66H3.23a9.75 9.75 0 0 0 0 8.68l3.27-2.47Z" />
                    <path fill="#EA4335" d="M12 6.1c1.44 0 2.73.5 3.75 1.5l2.81-2.81A9.4 9.4 0 0 0 12 2.25a9.78 9.78 0 0 0-8.77 5.4L6.5 10.1c.78-2.32 2.95-4 5.5-4Z" />
                  </svg>
                  <span>Google</span>
                  <small>{t('setupLater')}</small>
                </button>
                <button type="button" className="signup-provider signup-provider-facebook" disabled>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.86v-8.4H7.08V12h3.04V9.36c0-3 1.79-4.66 4.52-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.46h-2.79v8.4A12 12 0 0 0 24 12Z" />
                  </svg>
                  <span>Facebook</span>
                  <small>{t('setupLater')}</small>
                </button>
                <button type="button" className="signup-provider signup-provider-whatsapp" disabled>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#25D366" d="M12 1.5A10.4 10.4 0 0 0 3.1 17.3L1.7 22.5l5.3-1.4A10.5 10.5 0 1 0 12 1.5Z" />
                    <path fill="#fff" d="M17.9 14.9c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5H7.8c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z" />
                  </svg>
                  <span>WhatsApp</span>
                  <small>{t('setupLater')}</small>
                </button>
                <button type="button" className="signup-provider signup-provider-instagram" disabled>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <defs>
                      <linearGradient id="signup-instagram-gradient" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FFDC80" />
                        <stop offset="35%" stopColor="#F77737" />
                        <stop offset="68%" stopColor="#E1306C" />
                        <stop offset="100%" stopColor="#833AB4" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#signup-instagram-gradient)" />
                    <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8" />
                    <circle cx="17.2" cy="6.9" r="1.1" fill="#fff" />
                  </svg>
                  <span>Instagram</span>
                  <small>{t('setupLater')}</small>
                </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" tabIndex={-1}>
      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="hero-section" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
        <div className="hero-content" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '32px' }}>
          <motion.div
            key={currentSlide}
            className="hero-brand-lockup"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#" className="hero-brand-logo" style={{ textDecoration: 'none' }}>
              <motion.div
                initial={{ rotateY: 1800, rotateZ: 1080, scale: 0.2, opacity: 0 }}
                animate={{ rotateY: 0, rotateZ: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 3.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="hero-brand-logo-image"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 25px rgba(212,175,55,0.5))",
                      "drop-shadow(0 0 50px rgba(255,215,0,0.95))",
                      "drop-shadow(0 0 25px rgba(212,175,55,0.5))"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image src="/logotransparent.png" alt="Amorea Transparent Logo" width={180} height={180} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </motion.div>
              </motion.div>
            </a>

            <p
              className="coming-soon-animation"
              aria-label={t('comingSoon')}
              style={{ fontSize: 'clamp(30px, 5vw, 44px)', fontWeight: 500, fontFamily: 'var(--font-coming-soon), cursive', margin: 0 }}
            >
                {t('comingSoon').split('').map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  aria-hidden="true"
                  className="coming-soon-letter"
                  style={{ animationDelay: `${index * 170}ms` }}
                >
                  {character === ' ' ? '\u00a0' : character}
                </span>
              ))}
            </p>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-kicker"
            style={{ color: 'rgba(253, 230, 138, 0.9)', fontWeight: 600, letterSpacing: 'clamp(0.02em, 0.4vw, 0.08em)', fontSize: 'clamp(20px, 3vw, 32px)', marginBottom: '16px' }}
          >
            {t('heroKicker')}
          </motion.h1>

          <div className="hero-brand-line" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'normal', fontFamily: 'serif', color: '#e5e5e5' }}>
              {t('eleganceDefined')}
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

          <p className="hero-description" style={{ maxWidth: '600px', margin: '0 auto 28px auto', color: '#d4d4d4', fontSize: '15px', lineHeight: '1.6', fontWeight: 300 }}>
            {t('heroDescription')}
          </p>

          <div className="hero-actions" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
            <a 
              href="#shop"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', fontWeight: 'bold', padding: '14px 32px', borderRadius: '9999px', textDecoration: 'none', boxShadow: '0 0 25px rgba(245,158,11,0.4)', fontSize: '14px' }}
            >
              <ShoppingBag size={18} />
              <span>{t('exploreCollections')}</span>
            </a>
            <button 
              onClick={() => setIsChatOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.5)', backgroundColor: 'transparent', color: '#fde68a', padding: '14px 28px', borderRadius: '9999px', cursor: 'pointer', backdropFilter: 'blur(10px)', fontSize: '14px' }}
            >
              <Sparkles size={18} />
              <span>{t('chatWithStylist')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="shop" aria-labelledby="shop-heading" className="shop-section" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          className="shop-heading"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <span style={{ color: '#f59e0b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600, display: 'block', marginBottom: '12px' }}>{t('curatedPerfection')}</span>
          <h2 id="shop-heading" style={{ fontSize: '36px', fontFamily: 'serif', fontWeight: 'bold', color: '#fef3c7', marginBottom: '16px' }}>
            {t('featuredCollections')}
          </h2>
          <p style={{ color: '#a3a3a3', maxWidth: '500px', margin: '0 auto', fontSize: '14px' }}>
            {t('collectionsDescription')}
          </p>

          <div className="collection-filters" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            {categories.map((tab) => (
              <button
                key={tab.value}
                className="collection-filter-button"
                aria-pressed={activeCategory === tab.value}
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
                {t(tab.translationKey)}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="floating-product-card"
              layout
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4 }}
              style={{ backgroundColor: 'rgba(23, 23, 23, 0.82)', border: '1px solid rgba(245, 158, 11, 0.16)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            >
              <div className="product-image" style={{ position: 'relative', height: '320px', overflow: 'hidden', backgroundColor: '#000000' }}>
                <Image
                  src={product.image}
                  alt={translatedProduct(product, 'name')}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#f59e0b', color: '#000000', fontSize: '11px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {translatedProduct(product, 'badge')}
                </span>
              </div>

              <div className="product-card-content" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px' }}>
                    <Star size={14} fill="#f59e0b" />
                    <span>{product.rating}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#737373', letterSpacing: '0.2em', fontFamily: 'serif' }}>AMOREA</span>
                </div>
                <h3 className="product-title" style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>
                  {translatedProduct(product, 'name')}
                </h3>
                <div className="product-purchase-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #262626', paddingTop: '16px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>৳ {formatPrice(product.price)}</span>
                  <button 
                    className="product-cart-button"
                    onClick={() => addToCart(product)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#262626', color: '#f59e0b', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                  >
                    <ShoppingBag size={16} />
                    <span>{t('addToCart')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-heading" className="contact-section">
        <div className="contact-heading">
          <div className="contact-brand-logo-frame">
            <Image
              className="contact-brand-logo"
              src="/logo.JPG"
              alt="Amorea official logo"
              width={150}
              height={150}
            />
          </div>
          <span>{t('contactEyebrow')}</span>
          <h2 id="contact-heading">{t('contactHeading')}</h2>
          <p>{t('contactDescription')}</p>
        </div>
        <div className="contact-links">
          <a className="contact-link contact-link-phone" href="tel:+8801779747967">
            <span className="contact-link-top">
              <span className="contact-link-icon"><Phone size={21} aria-hidden="true" /></span>
              <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true" />
            </span>
            <span>{t('contactPhone')}</span>
            <strong>+880 1779 747967</strong>
          </a>
          <a className="contact-link contact-link-messenger" href="https://m.me/amorea.com.bd" target="_blank" rel="noopener noreferrer">
            <span className="contact-link-top">
              <span className="contact-link-icon">
                <svg className="brand-logo brand-logo-messenger" viewBox="0 0 24 24" aria-hidden="true">
                  <defs>
                    <linearGradient id="messenger-gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00B2FF" />
                      <stop offset="100%" stopColor="#006AFF" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#messenger-gradient)" d="M12 1.5C6.2 1.5 1.5 5.9 1.5 11.3c0 3 1.4 5.7 3.7 7.5.2.2.3.4.3.7l.1 2.2c0 .4.4.7.8.5l2.5-1.1c.2-.1.4-.1.7 0 .8.2 1.6.3 2.4.3 5.8 0 10.5-4.4 10.5-9.8S17.8 1.5 12 1.5Z" />
                  <path fill="#fff" d="m5.5 14.1 4.3-6.8c.3-.5 1-.6 1.5-.2l2.4 1.9c.2.2.6.2.8 0l3.9-3c.5-.4 1.2.2.8.7l-4.3 6.8c-.3.5-1 .6-1.5.2L11 11.8c-.2-.2-.6-.2-.8 0l-3.9 3c-.5.4-1.2-.2-.8-.7Z" />
                </svg>
              </span>
              <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true" />
            </span>
            <span>{t('contactMessenger')}</span>
            <strong>Amorea</strong>
          </a>
          <a className="contact-link contact-link-instagram" href="https://www.instagram.com/amorea.com.bd/" target="_blank" rel="noopener noreferrer">
            <span className="contact-link-top">
              <span className="contact-link-icon">
                <svg className="brand-logo brand-logo-instagram" viewBox="0 0 24 24" aria-hidden="true">
                  <defs>
                    <linearGradient id="instagram-gradient" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FFDC80" />
                      <stop offset="35%" stopColor="#F77737" />
                      <stop offset="68%" stopColor="#E1306C" />
                      <stop offset="100%" stopColor="#833AB4" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#instagram-gradient)" />
                  <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8" />
                  <circle cx="17.2" cy="6.9" r="1.1" fill="#fff" />
                </svg>
              </span>
              <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true" />
            </span>
            <span>{t('contactInstagram')}</span>
            <strong>@amorea.com.bd</strong>
          </a>
          <a className="contact-link contact-link-whatsapp" href="https://wa.me/8801779747967" target="_blank" rel="noopener noreferrer">
            <span className="contact-link-top">
              <span className="contact-link-icon">
                <svg className="brand-logo brand-logo-whatsapp" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#25D366" d="M12 1.5A10.4 10.4 0 0 0 3.1 17.3L1.7 22.5l5.3-1.4A10.5 10.5 0 1 0 12 1.5Z" />
                  <path fill="#fff" d="M17.9 14.9c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5H7.8c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z" />
                </svg>
              </span>
              <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true" />
            </span>
            <span>{t('contactWhatsApp')}</span>
            <strong>+880 1779 747967</strong>
          </a>
        </div>
      </section>
      </main>

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
              className="cart-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'relative', width: '100%', maxWidth: '400px', backgroundColor: '#171717', height: '100%', boxShadow: '-10px 0 30px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', zIndex: 10, borderLeft: '1px solid rgba(245,158,11,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'serif' }}>
                  <ShoppingBag size={20} /> {t('shoppingCart')} ({formatPrice(totalItems)})
                </h3>
                <button onClick={() => setIsCartOpen(false)} aria-label={t('close')} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: '#737373' }}>
                    <ShoppingBag size={48} style={{ margin: '0 auto 16px auto', opacity: 0.4 }} />
                    <p>{t('emptyCart')}</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '16px', backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '12px', border: '1px solid #262626', alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={item.image} alt={translatedProduct(item, 'name')} fill sizes="64px" style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>{translatedProduct(item, 'name')}</h4>
                        <p style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold' }}>৳ {formatPrice(item.price)}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} aria-label={t('decreaseQuantity')} style={{ padding: '4px 8px', backgroundColor: '#262626', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} aria-label={t('increaseQuantity')} style={{ padding: '4px 8px', backgroundColor: '#262626', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} aria-label={t('removeItem')} style={{ background: 'transparent', border: 'none', color: '#737373', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ padding: '24px', borderTop: '1px solid #262626', backgroundColor: 'rgba(0,0,0,0.9)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a3', marginBottom: '16px' }}>
                    <span>{t('subtotal')}</span>
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>৳ {formatPrice(subtotal)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    style={{ width: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', fontWeight: 'bold', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                  >
                    {t('proceedCheckout')}
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
              className="checkout-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: '#171717', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', zIndex: 10, maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #262626', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', fontFamily: 'serif' }}>{t('checkoutTitle')}</h3>
                <button onClick={() => setIsCheckoutOpen(false)} aria-label={t('close')} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {orderSuccess ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <CheckCircle size={64} style={{ color: '#34d399', margin: '0 auto 16px auto' }} />
                  <h4 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>{t('orderSuccess')}</h4>
                  <p style={{ color: '#a3a3a3', fontSize: '14px' }}>{t('orderSuccessDescription')}</p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#d4d4d4', fontWeight: 500, marginBottom: '6px' }}>{t('fullName')}</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t('namePlaceholder')}
                      style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#d4d4d4', fontWeight: 500, marginBottom: '6px' }}>{t('mobileNumber')}</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={t('phonePlaceholder')}
                      style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#d4d4d4', fontWeight: 500, marginBottom: '6px' }}>{t('deliveryAddress')}</label>
                    <textarea
                      required
                      rows={3}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder={t('addressPlaceholder')}
                      style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#d4d4d4', fontWeight: 500, marginBottom: '8px' }}>{t('deliveryArea')}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('inside')}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: deliveryZone === 'inside' ? '1px solid #f59e0b' : '1px solid #262626',
                          backgroundColor: deliveryZone === 'inside' ? 'rgba(245,158,11,0.1)' : '#0a0a0a',
                          color: '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{t('dhakaCity')}</div>
                        <div style={{ fontSize: '12px', color: '#f59e0b' }}>৳ {formatPrice(80)}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('outside')}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: deliveryZone === 'outside' ? '1px solid #f59e0b' : '1px solid #262626',
                          backgroundColor: deliveryZone === 'outside' ? 'rgba(245,158,11,0.1)' : '#0a0a0a',
                          color: '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{t('outsideDhaka')}</div>
                        <div style={{ fontSize: '12px', color: '#f59e0b' }}>৳ {formatPrice(150)}</div>
                      </button>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '12px', border: '1px solid #262626', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a3a3a3', fontSize: '13px' }}>
                      <span>{t('subtotal')}</span>
                      <span>৳ {formatPrice(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a3a3a3', fontSize: '13px' }}>
                      <span>{t('deliveryCharge')}</span>
                      <span>৳ {formatPrice(deliveryCharge)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontWeight: 'bold', fontSize: '16px', borderTop: '1px solid #262626', paddingTop: '8px', marginTop: '4px' }}>
                      <span>{t('totalPayable')}</span>
                      <span style={{ color: '#f59e0b' }}>৳ {formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ width: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', fontWeight: 'bold', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '12px', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                  >
                    {t('confirmOrder')}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Chat Drawer */}
      <div className="chat-launcher" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#000000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(245,158,11,0.5)', position: 'relative' }}
          >
            <Sparkles size={26} />
          </button>
        )}

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              className="chat-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{ width: '360px', height: '500px', backgroundColor: '#171717', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.9)' }}
            >
              <div style={{ padding: '16px 20px', backgroundColor: 'rgba(0,0,0,0.9)', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                    <Bot size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{t('chatTitle')}</h4>
                    <span style={{ fontSize: '10px', color: '#34d399' }}>{t('online')}</span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} aria-label={t('close')} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        lineHeight: '1.4',
                        backgroundColor: msg.sender === 'user' ? '#f59e0b' : '#262626',
                        color: msg.sender === 'user' ? '#000000' : '#ffffff',
                        borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                        borderBottomLeftRadius: msg.sender === 'ai' ? '2px' : '12px',
                      }}
                    >
                      {msg.translationKey ? t(msg.translationKey) : msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid #262626', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t('chatPlaceholder')}
                  style={{ flex: 1, backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '10px', padding: '10px 14px', color: '#ffffff', fontSize: '13px', outline: 'none' }}
                />
                <button
                  type="submit"
                  aria-label={t('sendMessage')}
                  style={{ backgroundColor: '#f59e0b', color: '#000000', border: 'none', borderRadius: '10px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}