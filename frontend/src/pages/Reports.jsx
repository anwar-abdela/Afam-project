import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl bg-opacity-90">
                <p className="text-[10px] font-black italic text-slate-400 mb-2 uppercase tracking-widest">{label}</p>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <p className="text-sm font-black text-white">${Number(payload[0].value).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

function MetricsBar({ title, value, colorClass, icon }) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-gray-100/50 transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">${value}</h3>
            </div>
        </div>
    );
}

export default function Reports() {
    const [summary, setSummary] = useState(null);
    const [salesTrend, setSalesTrend] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sumRes, trendRes] = await Promise.all([
                    api.get('/reports/summary'),
                    api.get('/reports/sales-trend')
                ]);
                setSummary(sumRes.data);
                setSalesTrend(trendRes.data);
            } catch (error) {
                toast.error('Failed to load analytical data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-black text-gray-400 italic uppercase">Reconciling Ledgers...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 focus:outline-none"></div>
                <div className="relative z-10 text-center md:text-left">
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase leading-none mb-2">Financial Intelligence</h1>
                    <p className="text-emerald-100 font-medium opacity-80">Holistic overview of retail performance and profitability.</p>
                </div>
                <div className="relative z-10 flex bg-white/10 backdrop-blur-md rounded-2xl p-2 gap-2 border border-white/20">
                    <button className="px-6 py-2 bg-white text-emerald-700 font-black text-xs italic uppercase rounded-xl transition-all hover:bg-emerald-50">Annual</button>
                    <button className="px-6 py-2 text-emerald-100 font-black text-xs italic uppercase rounded-xl transition-all hover:bg-white/10">Quarterly</button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <MetricsBar
                    title="Gross Revenue"
                    value={summary?.totalRevenue?.toFixed(2) || '0.00'}
                    colorClass="bg-indigo-600 text-white shadow-indigo-200"
                    icon="💰"
                />
                <MetricsBar
                    title="Operating Margin"
                    value={summary?.totalProfit?.toFixed(2) || '0.00'}
                    colorClass="bg-emerald-500 text-white shadow-emerald-200"
                    icon="⚖️"
                />
                <MetricsBar
                    title="Cost of Goods Sold"
                    value={(summary?.totalRevenue - summary?.totalProfit)?.toFixed(2) || '0.00'}
                    colorClass="bg-slate-800 text-white shadow-slate-200"
                    icon="📉"
                />
            </div>

            {/* Chart */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative group overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Revenue Trajectory</h2>
                        <p className="text-sm font-medium text-gray-400 mt-1 italic uppercase tracking-widest leading-none">Monthly Transactional Activity</p>
                    </div>
                    <div className="px-4 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        Growing +8%
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesTrend}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }}
                                dy={15}
                                textAnchor="middle"
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#4F46E5"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                animationDuration={2000}
                                dot={{ fill: '#4F46E5', strokeWidth: 2, r: 6, stroke: '#fff' }}
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#1E293B' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100/50 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-indigo-600 text-3xl flex items-center justify-center mb-6">📢</div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-2">Stock Efficiency</h3>
                    <p className="text-slate-500 text-sm font-medium px-4 leading-relaxed">
                        Currently tracking {summary?.totalProducts || 0} unique SKUs.
                        The system recommends restocking {summary?.lowStockCount || 0} items to maintain optimal throughput.
                    </p>
                </div>

                <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100/50 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-emerald-600 text-3xl flex items-center justify-center mb-6">🤝</div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-2">Cooperative Status</h3>
                    <p className="text-slate-500 text-sm font-medium px-4 leading-relaxed">
                        The cooperative fund is currently showing healthy growth.
                        All contributions are being synced daily with zero latency.
                    </p>
                </div>
            </div>
        </div>
    );
}
