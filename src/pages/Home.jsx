import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);

  const productsPerPage = 20;

  // Fetch products and categories
  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=100')
      .then((res) => res.json())
      .then((data) => setProducts(data.products));

    fetch('https://dummyjson.com/products/categories')
      .then((res) => res.json())
      .then((data) => {
        const clean = Array.isArray(data)
          ? data.map(cat => typeof cat === 'string' ? cat.trim() : cat.name?.trim())
          : [];
        setCategories(clean);
      });
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Filter + Sort
  const filteredProducts = products
    .filter(product =>
      product.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(product =>
      selectedCategory === 'All'
        ? true
        : product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
    )
    .filter(product => product.price >= minPrice && product.price <= maxPrice)
    .filter(product => product.rating >= minRating);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <div className="page-wrapper">
      {/* Search & Sort */}
      <div className="top-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="sort-container">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main layout: filters + products */}
      <div className="main-content" style={{ display: 'flex', gap: '1rem' }}>
        {/* Filters */}
        <div className="filters">
          <h3>Filters</h3>

          {/* Category Filter */}
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>

          {/* Price Range Filter */}
          <label>Price Range:</label>
          <div className="range">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          {/* Rating Filter */}
          <label>Min Rating:</label>
          <input
            type="number"
            placeholder="e.g., 3"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            min={0}
            max={5}
          />

          <button
                className="clear-btn"
                onClick={() => {
                    setSelectedCategory('All');
                    setMinPrice(0);
                    setMaxPrice(100000);
                    setMinRating(0);
                    setSearchText('');
                    setPage(1);
                }}
                >
                🧹 Clear Filters
          </button>

        </div>

        {/* Products */}
        <div style={{ flex: 1 }}>
          <div className="product-grid">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p style={{ textAlign: 'center' }}>No products found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              ⬅
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={page === i + 1 ? 'active' : ''}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              ➡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
