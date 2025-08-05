'use client';

import { Toaster } from '@/components/ui/sonner';

export function CartSonner() {

  return (
    <>
      <Toaster
        position="top-center"
        offset={81}
        mobileOffset={64}
        style={{
          zIndex: 50,
        }}
        toastOptions={{
          style: {
            background: "var(--restaurant-secondary)",
            border: "1px solid var(--border)",
            color: "var(--restaurant-foreground)",
          },
        }}
      />
    </>
  );
}

export default CartSonner;