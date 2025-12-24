import { Link } from 'react-router-dom';
// import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p>₹ {product.price}</p>
      <p>⭐ {product.rating}</p>

    </Link>
  );
}

export default ProductCard;
