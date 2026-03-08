import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function SummaryCard({ title, value, color, icon, detail }) {
    const colors = {
        primary: 'from-primary-500 to-blue-700 shadow-blue-100 text-primary-500',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-100 text-emerald-600',
        amber: 'from-amber-500 to-amber-600 shadow-amber-100 text-amber-600',
        rose: 'from-rose-500 to-rose-600 shadow-rose-100 text-rose-600',
        accent: 'from-accent to-accent-hover shadow-orange-100 text-accent',
        slate: 'from-slate-500 to-slate-600 shadow-slate-100 text-slate-600'
    };

    const config = colors[color] || colors.primary;
    const [gradient] = config.split(' shadow-');

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform`}></div>

            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
                        <span className="text-xl">{icon}</span>
                    </div>
                    {detail && (
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${config.split(' ').pop()} bg-opacity-10 border border-current`}>
                            {detail}
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/summary')
            .then(res => setData(res.data))
            .catch(() => toast.error('Failed to load dashboard data'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Hydrating Dashboard...</p>
        </div>
    );

    if (!data) return null;

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
                        Welcome back, <span className="text-primary-500 italic uppercase">System Admin</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Real-time business performance & inventory insights.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/reports" className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                        Full Reports
                    </Link>
                    <Link to="/sales" className="bg-accent px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-lg shadow-orange-100 hover:bg-accent-hover transition-all active:scale-95 flex items-center gap-2">
                        <span>Record Sale +</span>
                    </Link>
                </div>
            </div>

            {/* Today's Stats Grid */}
            <div className="space-y-4">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Activity Snapshot - Today</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SummaryCard
                        title="Today's Revenue"
                        value={`$${data.today.revenue.toFixed(2)}`}
                        color="primary"
                        icon="💵"
                        detail={`${data.today.count} transactions`}
                    />
                    <SummaryCard
                        title="Today's Profit"
                        value={`$${data.today.profit.toFixed(2)}`}
                        color="emerald"
                        icon="📈"
                        detail="Real-time"
                    />
                    <SummaryCard
                        title="Low Stock Alarm"
                        value={data.inventory.soldOutProducts}
                        color="rose"
                        icon="🚨"
                        detail="Critical Items"
                    />
                </div>
            </div>

            {/* Global Overview Grid */}
            <div className="space-y-4">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Cumulative Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    <SummaryCard
                        title="Global Revenue"
                        value={`$${data.sales.totalRevenue.toFixed(2)}`}
                        color="slate"
                        icon="🌍"
                    />
                    <SummaryCard
                        title="Net Global Profit"
                        value={`$${data.sales.totalProfit.toFixed(2)}`}
                        color="emerald"
                        icon="🏦"
                    />
                    <SummaryCard
                        title="Inventory Value"
                        value={`$${data.inventory.potentialProfit.toFixed(2)}`}
                        color="amber"
                        icon="💎"
                        detail="Unrealized Profit"
                    />
                    <SummaryCard
                        title="Active Members"
                        value={data.savings.activeMembers}
                        color="primary"
                        icon="👥"
                        detail="Cooperative"
                    />
                </div>
            </div>

            {/* Main Visual Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 relative z-10 gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none italic uppercase">Cooperative Ledger</h3>
                            <p className="text-sm text-gray-400 font-medium mt-1">Daily contribution health & group stability</p>
                        </div>
                        <div className="bg-primary-500/5 px-4 py-2 rounded-xl text-primary-500 font-black text-lg tracking-tighter tabular-nums border border-blue-100">
                            ${data.savings.totalSavings.toFixed(2)} Total Fund
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                        <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Missed</p>
                            <span className="text-2xl font-black text-rose-500">{data.savings.totalMissed}</span>
                        </div>
                        <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg per Member</p>
                            <span className="text-2xl font-black text-gray-900">${(data.savings.totalSavings / (data.savings.activeMembers || 1)).toFixed(1)}</span>
                        </div>
                        <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock Count</p>
                            <span className="text-2xl font-black text-gray-900">{data.inventory.totalProducts}</span>
                        </div>
                        <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 text-center group-hover:bg-primary-500 transition-all duration-500">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-white/70">Sync State</p>
                            <span className="text-2xl font-black text-emerald-500 group-hover:text-white">Live</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500 opacity-20 blur-[60px] rounded-full"></div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-xl font-black tracking-tight italic uppercase">System Intel</h3>
                        <div className="px-2 py-0.5 bg-primary-500/20 rounded-md text-[10px] font-bold text-primary-500 border border-primary-500/30 uppercase tracking-widest">Encrypted</div>
                    </div>

                    <div className="space-y-8 relative z-10 mt-12">
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_10px_#10b981]"></div>
                            <div>
                                <h4 className="text-sm font-bold tracking-tight">Financial Engine Clean</h4>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black opacity-80">All ledgers balanced</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shadow-lg ${data.inventory.soldOutProducts > 0 ? 'bg-rose-500 animate-pulse shadow-rose-500' : 'bg-emerald-500 shadow-emerald-500'}`}></div>
                            <div>
                                <h4 className="text-sm font-bold tracking-tight">Stock Pipeline</h4>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black opacity-80">
                                    {data.inventory.soldOutProducts > 0 ? `${data.inventory.soldOutProducts} Items need restock` : 'Warehouse saturated'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 relative z-10">
                        <Link to="/products" className="group w-full flex items-center justify-between bg-white text-slate-900 font-black px-6 py-4 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-black/40">
                            <span className="text-sm uppercase italic">Restock Portal</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
