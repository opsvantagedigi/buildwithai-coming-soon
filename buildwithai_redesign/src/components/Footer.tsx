import React from "react";

export default function Footer() {
  return (
    <footer className="backdrop-blur-md bg-white/20 border-t border-white/30 shadow-inner mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-white/90">
        <div>
          <span className="text-xl font-orbitron font-bold bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow bg-clip-text text-transparent">BUILD WITH AI</span>
          <p className="mt-2 text-white/70">© {new Date().getFullYear()} OpsVantage Digital. All rights reserved.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Products</h4>
          <ul className="space-y-1">
            <li><a href="/ai-website-builder" className="hover:text-brand-blue">AI Website Builder</a></li>
            <li><a href="/ecommerce-ai-builder" className="hover:text-brand-green">Ecommerce AI Builder</a></li>
            <li><a href="/wordpress-ai-builder" className="hover:text-brand-yellow">WordPress AI Builder</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Resources</h4>
          <ul className="space-y-1">
            <li><a href="/blog" className="hover:text-brand-blue">Blog</a></li>
            <li><a href="/case-studies" className="hover:text-brand-green">Case Studies</a></li>
            <li><a href="/glossaries" className="hover:text-brand-yellow">Glossaries</a></li>
            <li><a href="/comparisons" className="hover:text-brand-blue">Comparisons</a></li>
            <li><a href="/newsletter" className="hover:text-brand-green">Newsletter</a></li>
            <li><a href="/help-center" className="hover:text-brand-yellow">Help Center</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Company</h4>
          <ul className="space-y-1">
            <li><a href="/about" className="hover:text-brand-blue">About</a></li>
            <li><a href="/affiliates" className="hover:text-brand-green">Affiliates</a></li>
            <li><a href="/careers" className="hover:text-brand-yellow">Careers</a></li>
            <li><a href="/contact" className="hover:text-brand-blue">Contact</a></li>
            <li><a href="/privacy-policy" className="hover:text-brand-green">Privacy Policy</a></li>
            <li><a href="/trust-center" className="hover:text-brand-yellow">Trust Center</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
