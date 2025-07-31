"use client";

import { useCartStore } from "@/lib/stores/cartStore";
import { Button } from "@/components/ui/button";

const CartBottomModal = () => {
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-50">
      <span className="text-lg font-medium">
        {totalItems} item{totalItems > 1 ? "s" : ""} in cart
      </span>
      <Button onClick={openCart}>View Cart</Button>
    </div>
  );
};

export default CartBottomModal;
