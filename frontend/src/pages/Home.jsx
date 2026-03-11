import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ name, price, category, imageUrl }) => (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-500/5 border border-gray-100 group transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 active:scale-95 duration-500 hover:border-primary-500/10 relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10">
            Hot
        </div>
        <div className="w-full h-56 bg-background-light rounded-[1.5rem] mb-6 flex items-center justify-center overflow-hidden">
            <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
        </div>
        <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{category}</p>
            <h3 className="text-xl font-black text-primary-900 tracking-tighter leading-none italic">{name}</h3>
            <div className="flex items-center justify-between pt-4">
                <span className="text-2xl font-black text-primary-500 italic tracking-tighter">${price}</span>
                <button className="bg-accent text-white px-6 py-2 rounded-xl text-xs font-black uppercase italic tracking-tighter shadow-lg shadow-orange-500/20 hover:bg-accent-hover transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Cart
                </button>
            </div>
        </div>
    </div>
);

export default function Home() {
    return (
        <div className="space-y-24 pb-24">
            {/* Hero Section */}
            <section className="relative h-[85vh] bg-white overflow-hidden rounded-b-[4rem] shadow-2xl shadow-blue-500/5 border-b border-gray-100">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #2563EB 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse"></div>

                <div className="max-w-[1400px] mx-auto h-full px-6 flex flex-col md:flex-row items-center justify-between relative z-10 gap-12">
                    <div className="max-w-2xl space-y-10 text-center md:text-left pt-20 md:pt-0">
                        <div className="space-y-2 inline-block">
                            <span className="bg-primary-500/10 text-primary-500 text-xs font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full px-1">NEW ARRIVAL</span>
                            <div className="w-12 h-1 bg-accent rounded-full block mx-auto md:mx-0"></div>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black text-primary-900 leading-[0.9] italic tracking-tighter uppercase">
                            Modern <br />
                            <span className="text-primary-500">Workspace</span> <br />
                            Essential.
                        </h1>
                        <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
                            Premium tech artifacts curated for the modern professional. Elevate your performance with A Fam Tech, where security meets sleek design.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center md:justify-start">
                            <Link to="/dashboard" className="bg-accent text-white px-12 py-5 rounded-[1.5rem] text-sm font-black uppercase italic tracking-widest shadow-2xl shadow-orange-500/30 hover:bg-accent-hover transition-all active:scale-95 flex items-center gap-4 group">
                                Discover Store
                                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            <Link to="/products" className="text-primary-900 px-12 py-5 text-sm font-black uppercase italic tracking-widest hover:text-primary-500 transition-colors">
                                View Collection
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-3xl animate-float">
                        <img
                            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=2526"
                            alt="Premium Laptop"
                            className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-1000"
                        />
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="max-w-[1400px] mx-auto px-6 space-y-16">
                <div className="flex items-end justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-1 bg-primary-500 rounded-full"></div>
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">CURATED TECH</span>
                        </div>
                        <h2 className="text-5xl font-black text-primary-900 italic tracking-tighter uppercase leading-none">
                            Featured <span className="text-slate-200">Artifacts</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <ProductCard name="Air Glide Max" price="549.00" category="Audio Tech" imageUrl="https://images.unsplash.com/photo-1546435770-a3e4265da3ec?auto=format&fit=crop&q=80&w=2670" />
                    <ProductCard name="Space Keyboard v2" price="199.00" category="Peripherals" imageUrl="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=2665" />
                    <ProductCard name="Orbit Ultra" price="299.00" category="Displays" imageUrl="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=2670" />
                    <ProductCard name="Titan Drive X" price="129.00" category="Storage" imageUrl="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2620" />
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-[1400px] mx-auto px-6">
                <div className="bg-primary-900 rounded-[4rem] p-16 md:p-32 flex flex-col items-center text-center space-y-12 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-blue-600/5 rotate-12 -translate-y-1/2 scale-150 blur-3xl"></div>
                    <div className="relative z-10 space-y-6 max-w-3xl">
                        <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-tight">
                            Ready to Upgrade <br />
                            <span className="text-accent">Your Setup?</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">
                            Join over 50,000 tech enthusiasts who trust A Fam Tech for their hardware needs. Exclusive deals and premium support waiting for you.
                        </p>
                        <div className="pt-8">
                            <Link to="/dashboard" className="bg-accent text-white px-20 py-6 rounded-[2rem] text-sm font-black uppercase italic tracking-widest shadow-2xl shadow-orange-500/40 hover:bg-accent-hover transition-all active:scale-95">
                                Start Your Mission
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
