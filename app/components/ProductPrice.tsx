'use client';

interface ProductPriceProps {
  price: string;
}

export default function ProductPrice({ price }: ProductPriceProps) {
  return (
    <div className="mb-8">
      <p className="font-['Dela_Gothic_One',sans-serif] text-3xl bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
        {price}
      </p>
    </div>
  );
}
