import React from "react";

export default function Header() {
  return (
    <header className="backdrop-blur-md bg-white/20 border-b border-white/30 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow bg-clip-text text-transparent tracking-widest">BUILD WITH AI</span>
        </div>
        <nav className="flex gap-6 text-base font-inter">
          <a href="/products" className="hover:text-brand-blue transition">Products</a>
          <a href="/features" className="hover:text-brand-green transition">Features</a>
          <a href="/ai-tools" className="hover:text-brand-yellow transition">AI Tools</a>
          <a href="/wordpress" className="hover:text-brand-blue transition">WordPress</a>
          <a href="/platform" className="hover:text-brand-green transition">Platform</a>
          <a href="/solutions" className="hover:text-brand-yellow transition">Solutions</a>
          <a href="/resources" className="hover:text-brand-blue transition">Resources</a>
          <a href="/company" className="hover:text-brand-green transition">Company</a>
          <a href="/pricing" className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow text-white font-bold shadow hover:scale-105 transition">Pricing</a>
        </nav>
      </div>
    </header>
  );
}
