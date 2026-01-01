import React from "react";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]   // ✅ always first image
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
