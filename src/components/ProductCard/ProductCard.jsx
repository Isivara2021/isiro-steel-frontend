import React from "react";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  // ✅ Function to generate optimized Cloudinary thumbnail
  const getOptimizedImage = (url) => {
    if (!url) return "/placeholder.png";

    // Check if it's a Cloudinary URL
    if (url.includes("res.cloudinary.com")) {
      // w_400,h_400,c_fill = 400x400 cropped, q_auto,f_auto = auto quality & format
      return url.replace(
        "/upload/",
        "/upload/w_400,h_400,c_fill,q_auto,f_auto/"
      );
    }

    // Fallback for non-Cloudinary URLs
    return url;
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? getOptimizedImage(product.images[0])
      : "/placeholder.png";

  return (
    <div className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={product.name}
          className={styles.productImage}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDescription}>
          {product.shortDescription}
        </p>
        <p className={styles.productPrice}>Rs {product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
