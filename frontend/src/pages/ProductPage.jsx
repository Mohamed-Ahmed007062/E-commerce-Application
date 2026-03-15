import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Star, Heart, ShoppingCart, Truck, RotateCcw, ShieldCheck, Minus, Plus, ArrowLeft } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('White');
  const [selectedImage, setSelectedImage] = useState(0);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['White', 'Black', 'Gray', 'Navy'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        // Fallback for UI demonstration
        setProduct({
          _id: id,
          name: 'Classic White T-Shirt',
          price: 29.99,
          rating: 4.5,
          numReviews: 89,
          description: 'Premium cotton t-shirt with a perfect fit. Comfortable for everyday wear.',
          category: { name: 'Men' },
          images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80',
          ],
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
          countInStock: 150,
          tags: ['casual', 'basic', 'cotton'],
        });
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user && product?._id) {
      api.get('/wishlist').then(({ data }) => setInWishlist((data || []).some((p) => p._id === product._id))).catch(() => {});
    } else {
      setInWishlist(false);
    }
  }, [user, product?._id]);

  const addToCartHandler = async () => {
    if (user) {
      setAdding(true);
      try {
        await api.post('/cart', { productId: id, qty });
        navigate('/cart');
      } catch (_) {}
      setAdding(false);
      return;
    }
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const toggleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${id}`);
        setInWishlist(false);
      } else {
        await api.post('/wishlist', { productId: id });
        setInWishlist(true);
      }
    } catch (_) {}
    setWishlistLoading(false);
  };

  const incrementQty = () => {
    if (qty < (product?.countInStock || 1)) setQty(qty + 1);
  };

  const decrementQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  /* Build images array from product data */
  const getImages = () => {
    if (product?.images && product.images.length > 0) return product.images;
    if (product?.image) return [product.image];
    return [];
  };

  /* Render star rating */
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={18} fill="#f59e0b" stroke="#f59e0b" />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} style={{ position: 'relative', display: 'inline-flex' }}>
            <Star size={18} fill="none" stroke="#e5e7eb" />
            <span style={{ position: 'absolute', overflow: 'hidden', width: '50%' }}>
              <Star size={18} fill="#f59e0b" stroke="#f59e0b" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} size={18} fill="none" stroke="#e5e7eb" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-state" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) return null;

  const images = getImages();

  return (
    <div className="animate-fade-in">
      <div className="container pdp-container">
        {/* ═══ LEFT: IMAGE GALLERY ═══ */}
        <div className="pdp-gallery">
          {/* Main Image */}
          <div className="pdp-main-image">
            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="pdp-thumbnails">
              {images.slice(1).map((img, idx) => (
                <button
                  key={idx}
                  className={`pdp-thumb ${selectedImage === idx + 1 ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx + 1)}
                >
                  <img src={img} alt={`${product.name} view ${idx + 2}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══ RIGHT: PRODUCT INFO ═══ */}
        <div className="pdp-info">
          {/* Back Link */}
          <Link to="/shop" className="pdp-back">
            <ArrowLeft size={16} /> Back to Shop
          </Link>

          {/* Product Name */}
          <h1 className="pdp-name">{product.name}</h1>

          {/* Rating */}
          <div className="pdp-rating">
            <div className="pdp-stars">{renderStars(product.rating || 0)}</div>
            <span className="pdp-rating-value">{product.rating}</span>
            <span className="pdp-reviews">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <p className="pdp-price">${product.price?.toFixed(2)}</p>

          {/* Description */}
          <p className="pdp-description">{product.description}</p>

          {/* Size Selector */}
          <div className="pdp-option-group">
            <label className="pdp-label">Size</label>
            <div className="pdp-sizes">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`pdp-size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="pdp-option-group">
            <label className="pdp-label">Color</label>
            <div className="pdp-colors">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`pdp-color-btn ${selectedColor === color ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="pdp-option-group">
            <label className="pdp-label">Quantity</label>
            <div className="pdp-quantity-row">
              <div className="pdp-quantity">
                <button className="pdp-qty-btn" onClick={decrementQty}><Minus size={16} /></button>
                <span className="pdp-qty-value">{qty}</span>
                <button className="pdp-qty-btn" onClick={incrementQty}><Plus size={16} /></button>
              </div>
              <span className="pdp-stock">{product.countInStock} in stock</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pdp-actions">
            <button
              className="btn btn-primary pdp-add-to-cart"
              onClick={addToCartHandler}
              disabled={product.countInStock === 0 || adding}
            >
              <ShoppingCart size={18} />
              {adding ? 'Adding...' : product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button type="button" className="pdp-wishlist-btn" onClick={toggleWishlist} disabled={wishlistLoading} title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pdp-trust">
            <div className="pdp-trust-item">
              <Truck size={18} />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="pdp-trust-item">
              <RotateCcw size={18} />
              <span>30-day easy returns</span>
            </div>
            <div className="pdp-trust-item">
              <ShieldCheck size={18} />
              <span>Secure checkout</span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="pdp-tags-section">
              <label className="pdp-label">Tags</label>
              <div className="pdp-tags">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="pdp-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
