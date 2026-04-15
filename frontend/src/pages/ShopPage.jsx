import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Star, SlidersHorizontal, Search } from 'lucide-react';

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', 'Men', 'Women', 'Accessories', 'Shoes'];

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        // Fallback mock data
        setProducts([
          { _id: '1', name: 'Running Sneakers', price: 119.99, rating: 4.9, numReviews: 312, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', category: { name: 'Shoes' } },
          { _id: '2', name: 'Floral Summer Dress', price: 59.99, rating: 4.8, numReviews: 203, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', category: { name: 'Women' } },
          { _id: '3', name: 'High-Waisted Yoga Pants', price: 54.99, rating: 4.8, numReviews: 234, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80', category: { name: 'Women' } },
          { _id: '4', name: 'Slim Fit Denim Jeans', price: 79.99, rating: 4.7, numReviews: 156, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80', category: { name: 'Men' } },
          { _id: '5', name: 'Classic Leather Belt', price: 34.99, rating: 4.6, numReviews: 89, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80', category: { name: 'Accessories' } },
          { _id: '6', name: 'Cotton Crew Neck T-Shirt', price: 24.99, rating: 4.5, numReviews: 421, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', category: { name: 'Men' } },
          { _id: '7', name: 'Silk Blouse', price: 68.99, rating: 4.7, numReviews: 178, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80', category: { name: 'Women' } },
          { _id: '8', name: 'Canvas Backpack', price: 45.99, rating: 4.4, numReviews: 267, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', category: { name: 'Accessories' } },
        ]);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ── Filter & Sort ── */
  let filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category?.name === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="animate-fade-in">
      {/* ═══ SHOP HEADER ═══ */}
      <section className="shop-header">
        <div className="container">
          <h1 className="shop-header__title">Shop All Products</h1>
          <p className="shop-header__subtitle">Browse our curated collection of premium fashion</p>
        </div>
      </section>

      <section className="container" style={{ padding: '2rem 2rem 4rem' }}>
        {/* ═══ TOOLBAR ═══ */}
        <div className="shop-toolbar">
          <div className="shop-search">
            <Search size={18} className="shop-search__icon" />
            <input
              type="text"
              placeholder="Search products..."
              className="input-field shop-search__input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="shop-filters">
            <div className="shop-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`shop-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="shop-sort">
              <SlidersHorizontal size={16} />
              <select
                className="shop-sort__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══ RESULTS INFO ═══ */}
        <p className="shop-results-count">
          Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
          {selectedCategory !== 'All' && <> in <strong>{selectedCategory}</strong></>}
        </p>

        {/* ═══ PRODUCT GRID ═══ */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found.</p>
            <button className="btn btn-outline-sm" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-card__image-wrapper">
                  <img
                    src={product.image || FALLBACK_PRODUCT_IMAGE}
                    alt={product.name}
                    className="product-card__image"
                    onError={(e) => { e.currentTarget.src = FALLBACK_PRODUCT_IMAGE; }}
                  />
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ShopPage;
