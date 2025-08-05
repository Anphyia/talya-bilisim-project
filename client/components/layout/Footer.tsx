"use client";

import { useThemeStore } from '@/lib/stores/themeStore';

const Footer = () => {
  const { branding } = useThemeStore();

  return (
    <footer className="restaurant-bg-secondary p-4 text-center">
      <p className="text-white">© 2025 {branding.departmentname}. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
