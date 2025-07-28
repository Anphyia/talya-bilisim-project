'use client';

import { CartDrawer } from './CartDrawer';
import { CartSheet } from './CartSheet';

export function CartProvider() {
  return (
    <>
      <CartDrawer />
      <CartSheet />
    </>
  );
}

export default CartProvider;
