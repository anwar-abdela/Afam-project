import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StoreLayout() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background-light font-sans text-gray-900">
            {/* Header */}
            <header className="bg-primary-900 text-white shadow-xl">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-900 font-black text-xl italic transition-transform group-hover:scale-110">
                            A
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Fam Tech</h1>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-slate-300">
                        <Link to="/" className="text-sm font-bold hover:text-white transition-colors">Home</Link>
                        <Link to="/products" className="text-sm font-bold hover:text-white transition-colors">Admin Store</Link>
                        <Link to="/categories" className="text-sm font-bold hover:text-white transition-colors">Admin Categories</Link>
                    </nav>

                    <div className="flex items-center gap-6">
                        <button className="relative hover:text-accent transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                        <button className="relative hover:text-accent transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] font-black flex items-center justify-center rounded-full text-white">0</span>
                        </button>
                        {user ? (
                            <Link to="/dashboard" className="bg-primary-500 hover:bg-primary-600 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                                Dashboard
                            </Link>
                        ) : (
                            <Link to="/login" className="bg-primary-500 hover:bg-primary-600 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-primary-900 text-slate-400 py-16">
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary-900 font-black text-lg italic">
                                A
                            </div>
                            <h2 className="text-xl font-black text-white italic tracking-tighter">FAM</h2>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Your trusted destination for premium tech and modern lifestyle essentials. Quality products, secure shopping, and fast delivery.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link to="/" className="hover:text-white transition-colors">Support Center</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">Store</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link to="/" className="hover:text-white transition-colors">Laptops</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Accessories</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Smart Home</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">Newsletter</h3>
                        <p className="text-xs mb-4">Stay updated with our latest offers.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs w-full focus:outline-none focus:border-primary-500" />
                            <button className="bg-accent text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-accent-hover transition-colors">Join</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1400px] mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-widest">
                    &copy; 2026 A Fam Tech. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
