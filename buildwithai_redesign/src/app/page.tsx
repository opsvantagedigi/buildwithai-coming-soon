import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-brand">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 py-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-orbitron font-bold bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow bg-clip-text text-transparent mb-6 drop-shadow-lg animate-fade-in">
          The Future of Website Building is Here
        </h1>
        <p className="text-xl md:text-2xl font-inter text-white/90 mb-8 max-w-2xl animate-fade-in delay-100">
          Build, launch, and grow your business with the most advanced AI Website Builder. Effortless. Futuristic. Powerful.
        </p>
        <div className="flex gap-4 animate-fade-in delay-200">
          <a href="/dashboard" className="px-8 py-3 rounded-lg bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow text-white font-bold shadow-lg hover:scale-105 transition">Try Free</a>
          <a href="#features" className="px-8 py-3 rounded-lg border border-white/40 text-white font-bold hover:bg-white/10 transition">See Features</a>
        </div>
        {/* Animated AI Demo Placeholder */}
        <div className="mt-12 w-full flex justify-center animate-fade-in delay-300">
          <div className="rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl p-8 max-w-2xl border border-white/20">
            <span className="font-orbitron text-lg text-brand-blue">[Animated AI Website Demo Here]</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-7xl px-6 py-20 grid md:grid-cols-3 gap-10 animate-fade-in-up">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 flex flex-col items-center">
          <span className="text-4xl mb-4">🤖</span>
          <h2 className="font-orbitron text-2xl mb-2 bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow bg-clip-text text-transparent">AI Website Builder</h2>
          <p className="text-white/80">Create stunning websites in seconds with AI-powered design, content, and SEO.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 flex flex-col items-center">
          <span className="text-4xl mb-4">🛒</span>
          <h2 className="font-orbitron text-2xl mb-2 bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow bg-clip-text text-transparent">Ecommerce AI Builder</h2>
          <p className="text-white/80">Launch your online store with AI-driven product pages, checkout, and marketing tools.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 flex flex-col items-center">
          <span className="text-4xl mb-4">📝</span>
          <h2 className="font-orbitron text-2xl mb-2 bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow bg-clip-text text-transparent">WordPress AI Builder</h2>
          <p className="text-white/80">Effortlessly create and manage WordPress sites with AI-powered tools and hosting.</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full max-w-7xl px-6 py-16 flex flex-col items-center text-center animate-fade-in-up delay-200">
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow bg-clip-text text-transparent mb-4">Start Building Your Future Website Today</h2>
        <p className="text-lg text-white/80 mb-6">Join thousands of businesses, creators, and agencies using Build With AI to power their online presence.</p>
        <a href="/dashboard" className="px-10 py-4 rounded-lg bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow text-white font-bold shadow-lg hover:scale-105 transition">Get Started Free</a>
      </section>

      {/* More sections (Pricing, Testimonials, FAQ, etc.) can be added here following the same design system */}
    </main>
  );
}
