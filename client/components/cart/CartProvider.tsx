'use client';

import { CartSonner } from './CartSonner';
import { CartSheet } from './CartSheet';
import CartBottomModal from './CartBottomModal';

export function CartProvider() {
  return (
    <>
      <CartSonner />
      <CartSheet />
      <CartBottomModal />
    </>
  );
}

export default CartProvider;
