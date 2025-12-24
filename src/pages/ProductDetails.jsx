import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
        <img src={product.thumbnail} alt={product.title} className="product-image" />

        <div className="product-info">
            <h2>{product.title}</h2>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Rating:</strong> ⭐ {product.rating}</p>
            <p><strong>Price:</strong> ₹ {product.price}</p>
            <p className="description">{product.description}</p>
        </div>
   </div>

  );
}

export default ProductDetails;

