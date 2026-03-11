import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const StockBadge = ({ qty }) => {
    let colorClass = "bg-emerald-100 text-emerald-700 ring-emerald-200";
    let text = "Good Stock";

    if (qty === 0) {
        colorClass = "bg-rose-100 text-rose-700 ring-rose-200";
        text = "Out of Stock";
    } else if (qty < 5) {
        colorClass = "bg-amber-100 text-amber-700 ring-amber-200";
        text = "Low Stock";
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${colorClass}`}>
            {text}: {qty}
        </span>
    );
};

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ productId: '', quantity: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [prodRes, salesRes, summaryRes] = await Promise.all([
                api.get('/products'),
                api.get('/sales'),
                api.get('/sales/history-summary')
            ]);
            setProducts(prodRes.data.filter(p => !p.isArchived));
            setSales(salesRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            toast.error('Failed to sync with command center');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Auto-refresh every minute
        return () => clearInterval(interval);
    }, []);

    const selectedProduct = products.find(p => p.id === formData.productId);
    const totalValue = selectedProduct ? selectedProduct.sellingPrice * formData.quantity : 0;
    const isOverStock = selectedProduct ? formData.quantity > selectedProduct.quantity : false;

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const adjustQuantity = (amount) => {
        setFormData(prev => ({
            ...prev,
            quantity: Math.max(1, prev.quantity + amount)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productId) return toast.error('Identify target product');
        if (isOverStock) return toast.error('Insufficient inventory capacity');

        setSubmitting(true);
        try {
            await api.post('/sales', {
                productId: formData.productId,
                quantity: Number(formData.quantity)
            });
            toast.success('Transaction Encrypted & Recorded');
            setFormData({ productId: '', quantity: 1 });
            setSearchTerm('');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signal disruption: Recording failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Mission Intel (Summary) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-primary-500/20 transition-all duration-700"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Today's Revenue</p>
                    <h3 className="text-4xl font-black text-white italic tracking-tighter">${summary?.today?.revenue.toFixed(2) || '0.00'}</h3>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {summary?.today?.count || 0} Successful Missions
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Daily Net Profit</p>
                    <h3 className="text-4xl font-black text-primary-500 italic tracking-tighter">${summary?.today?.profit.toFixed(2) || '0.00'}</h3>
                    <div className="mt-4 flex items-center gap-2 text-primary-500/60 text-[10px] font-bold uppercase">
                        Efficiency: {summary?.today?.revenue > 0 ? ((summary.today.profit / summary.today.revenue) * 100).toFixed(1) : 0}%
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Total Fleet Revenue</p>
                    <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter">${summary?.overall?.revenue.toFixed(2) || '0.00'}</h3>
                    <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase">
                        Database Synchronized
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Transaction Command (Form) */}
                <div className="xl:col-span-1">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-gray-100 sticky top-12 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase leading-none">Record Sale</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">New Intelligence Entry</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Search & Select</label>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Filter products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-300"
                                    />
                                    <div className="relative group">
                                        <select
                                            required
                                            value={formData.productId}
                                            onChange={e => setFormData({ ...formData, productId: e.target.value })}
                                            className="w-full bg-primary-900 border-none rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all font-bold appearance-none cursor-pointer pr-12"
                                        >
                                            <option value="">Identify Product</option>
                                            {filteredProducts.map(p => (
                                                <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                                    {p.name} {p.quantity <= 0 ? '(DEPLETED)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {selectedProduct && (
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pricing</p>
                                            <p className="text-sm font-black text-primary-500 italic">${Number(selectedProduct.sellingPrice).toFixed(2)}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                            <StockBadge qty={selectedProduct.quantity} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Operational Quantity</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => adjustQuantity(-1)}
                                        className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center font-black text-xl hover:bg-white hover:border-primary-500 transition-all active:scale-90"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: Math.max(1, Number(e.target.value)) })}
                                        className={`flex-1 bg-gray-50 border-2 rounded-2xl px-4 py-3 text-center text-xl font-black transition-all ${isOverStock ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-transparent focus:border-primary-500'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => adjustQuantity(1)}
                                        className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center font-black text-xl hover:bg-white hover:border-primary-500 transition-all active:scale-90"
                                    >
                                        +
                                    </button>
                                </div>
                                {isOverStock && (
                                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest text-center px-2">WARNING: Operation exceeds available supply</p>
                                )}
                            </div>

                            <div className="pt-4 space-y-4">
                                <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2rem]">Total Impact</p>
                                    <p className="text-3xl font-black text-primary-500 italic tracking-tighter">${totalValue.toFixed(2)}</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || isOverStock || !formData.productId}
                                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-30 disabled:grayscale text-white font-black italic uppercase tracking-widest rounded-3xl py-5 transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-95 text-xs"
                                >
                                    {submitting ? (
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            Initiate Transaction
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* History Intel (Table) */}
                <div className="xl:col-span-3">
                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">Recent Transactions</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Confirmed Encrypted Logs</p>
                            </div>
                            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 shadow-sm animate-pulse-slow">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Core Synced
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Sequence</th>
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Artifact Details</th>
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                                        <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Yield</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {loading ? (
                                        <tr><td colSpan="4" className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-[4px] border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Decoding History...</p>
                                            </div>
                                        </td></tr>
                                    ) : sales.length === 0 ? (
                                        <tr><td colSpan="4" className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-30">
                                                <span className="text-6xl text-slate-200 uppercase font-black italic">Station Idle</span>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for tactical transactions</p>
                                            </div>
                                        </td></tr>
                                    ) : (
                                        sales.slice(0, 20).map((sale) => (
                                            <tr key={sale.id} className="hover:bg-primary-50/20 transition-all group cursor-default">
                                                <td className="px-10 py-6 whitespace-nowrap">
                                                    <p className="text-xs font-black text-slate-900 group-hover:text-primary-500 transition-colors uppercase italic">{new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-1">{new Date(sale.saleDate).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-10 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-black text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                                            {sale.product?.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-primary-500 transition-colors">{sale.product?.name || 'Artifact Expired'}</p>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-[10px] font-black text-accent uppercase italic">{sale.quantity} UNIT(S)</span>
                                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">@ ${Number(sale.unitPrice).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 uppercase">
                                                            {sale.user?.name.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sale.user?.name || 'SYS-BOT'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 whitespace-nowrap text-right">
                                                    <p className="text-lg font-black text-primary-500 italic tracking-tighter leading-none">${Number(sale.totalPrice).toFixed(2)}</p>
                                                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1.5">+${Number(sale.profit).toFixed(2)} Yield</p>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
