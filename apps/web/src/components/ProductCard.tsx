"use client";

import Image from "next/image";
import { useState } from "react";
import { categoryLabel, formatVnd, type Product } from "@/lib/products";

const FALLBACK = "/images/menu/fallback.svg";

export default function ProductCard({ product }: { product: Product }) {
  const [broken, setBroken] = useState(false);
  // Do not let arbitrary URLs from an API become remote image fetches in this MVP.
  const safePath = product.imageUrl?.startsWith("/images/menu/") ? product.imageUrl : null;
  const image = !broken && safePath ? safePath : FALLBACK;
  return (
    <article className="drink-card" aria-label={product.name}>
      <div className="drink-image-wrap">
        <Image key={image} className="drink-image" src={image} alt={product.name}
          width={480} height={360} unoptimized onError={() => setBroken(true)} />
      </div>
      <div className="drink-meta">
        <span className="category">{categoryLabel(product.category)}</span>
        {!product.available && <span className="soldout">Hết hàng</span>}
      </div>
      <h3>{product.name}</h3>
      <p className="drink-description">{product.description}</p>
      <p className="price">{formatVnd(product.basePrice)}</p>
    </article>
  );
}
