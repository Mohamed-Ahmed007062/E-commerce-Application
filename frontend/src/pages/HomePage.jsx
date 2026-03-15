import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Star, ArrowRight, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

/* ─── Product Card ─── */
const ProductCard = ({ product }) => (
  <div className="product-card">
    <div className="product-card__image-wrapper">
      <img src={product.image} alt={product.name} className="product-card__image" />
    </div>
    <div className="product-card__info">
      <h3 className="product-card__name">{product.name}</h3>
      <div className="product-card__rating">
        <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
        <span className="product-card__rating-value">{product.rating}</span>
        <span className="product-card__reviews">({product.numReviews})</span>
      </div>
      <p className="product-card__price">${product.price.toFixed(2)}</p>
    </div>
    <Link to={`/product/${product._id}`} className="btn btn-primary product-card__btn">
      View Details
    </Link>
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        // Fallback mock data matching Figma
        setProducts([
          { _id: '1', name: 'Running Sneakers', price: 119.99, rating: 4.9, numReviews: 312, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', category: { name: 'Shoes' } },
          { _id: '2', name: 'Floral Summer Dress', price: 59.99, rating: 4.8, numReviews: 203, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', category: { name: 'Women' } },
          { _id: '3', name: 'High-Waisted Yoga Pants', price: 54.99, rating: 4.8, numReviews: 234, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80', category: { name: 'Women' } },
          { _id: '4', name: 'Slim Fit Denim Jeans', price: 79.99, rating: 4.7, numReviews: 156, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80', category: { name: 'Men' } },
        ]);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categoryImages = { Men: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=500&q=80', Women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80', Accessories: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=500&q=80', Shoes: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80' };
  const displayCategories = categories.length > 0 ? categories : [{ _id: 'men', name: 'Men' }, { _id: 'women', name: 'Women' }, { _id: 'accessories', name: 'Accessories' }, { _id: 'shoes', name: 'Shoes' }];

  const trustFeatures = [
    { icon: <Truck size={28} />, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: <RotateCcw size={28} />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <ShieldCheck size={28} />, title: 'Secure Payment', desc: '100% secure transactions' },
  ];

  return (
    <div className="animate-fade-in">

      {/* ═══ HERO SECTION ═══ */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">New Season Arrivals</h1>
          <p className="hero-subtitle">Discover the latest trends in fashion and style</p>
          <Link to="/shop" className="btn btn-hero">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ═══ CATEGORIES SECTION ═══ */}
      <section className="container section-spacing">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {displayCategories.slice(0, 4).map((cat) => (
            <Link to={cat._id ? `/categories/${cat._id}` : `/shop?category=${cat.name}`} key={cat._id || cat.name} className="category-card">
              <div className="category-card__image-wrapper">
                <img src={categoryImages[cat.name] || categoryImages.Men} alt={cat.name} className="category-card__image" />
              </div>
              <h3 className="category-card__title">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="container section-spacing">
        <div className="section-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Products</h2>
          <Link to="/shop" className="btn btn-outline-sm">View All</Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ═══ TRUST FEATURES ═══ */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            {trustFeatures.map((item, idx) => (
              <div key={idx} className="trust-card">
                <div className="trust-card__icon">{item.icon}</div>
                <h3 className="trust-card__title">{item.title}</h3>
                <p className="trust-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
